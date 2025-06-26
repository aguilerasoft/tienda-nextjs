'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import { fetchProductoTiendaPorId } from '@/services/apiTienda';
import { whatsapp } from '@/app/data-products';

console.log(whatsapp[0].number)

interface UploadedFile {
  name: string;
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  basePrice: number;
  customizable: boolean;
  image: string;
  sizes?: string[];
  colors?: string[];
  customizationOptions?: {
    type?: 'text' | 'image';
    maxTextLength?: number;
    maxImages?: number;
    imageTypes?: string[];
    maxImageSize?: number;
  };
}

interface CustomizationForm {
  size: string;
  color: string;
  text: string;
  images: File[];
  notes: string;
  uploadedFiles?: UploadedFile[];
}

interface ProductCustomizerProps {
  product: Product;
  onSubmit: (form: CustomizationForm) => void;
}

const ProductCustomizer = ({ product, onSubmit }: ProductCustomizerProps) => {
  const [form, setForm] = useState<CustomizationForm>({
    size: product.sizes?.[0] || '',
    color: product.colors?.[0] || '',
    text: '',
    images: [],
    notes: ''
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const maxFiles = product.customizationOptions?.maxImages || 1;
    const validTypes = product.customizationOptions?.imageTypes || ['image/jpeg', 'image/png'];
    const maxSize = (product.customizationOptions?.maxImageSize || 5) * 1024 * 1024;

    // Validación de archivos
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`Tipo de archivo no permitido: ${file.name}. Use ${validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`Archivo demasiado grande: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB). Máximo permitido: ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    // Validar cantidad máxima
    if (form.images.length + validFiles.length > maxFiles) {
      alert(`Solo puedes subir hasta ${maxFiles} ${maxFiles === 1 ? 'imagen' : 'imágenes'}`);
      return;
    }

    const newImages = [...form.images, ...validFiles];
    setForm(prev => ({ ...prev, images: newImages }));

    // Mostrar primera imagen como vista previa
    if (newImages.length > 0 && !preview) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setPreview(reader.result as string);
      };
      reader.readAsDataURL(newImages[0]);
      setSelectedImageIndex(0);
    }
  };

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, images: newImages }));

    if (newImages.length === 0) {
      setPreview(null);
      setSelectedImageIndex(null);
    } else if (index === selectedImageIndex) {
      // Actualizar vista previa si se elimina la imagen actual
      const newIndex = Math.min(index, newImages.length - 1);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setPreview(reader.result as string);
      };
      reader.readAsDataURL(newImages[newIndex]);
      setSelectedImageIndex(newIndex);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadFilesToServer = async (): Promise<UploadedFile[]> => {
    const uploadedResults: UploadedFile[] = [];
    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`Error al subir ${file.name}`);

        const result = await response.json();
        uploadedResults.push({
          name: file.name,
          url: result.downloadUrl // Asegúrate que tu API devuelve una URL pública aquí
        });

        // Actualizar progreso
        setUploadProgress(((i + 1) / form.images.length) * 100);

      } catch (error) {
        console.error(`Error al subir ${file.name}:`, error);
        throw error;
      }
    }
    return uploadedResults;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se hayan subido imágenes si es requerido
    if (product.customizationOptions?.type === 'image' && form.images.length === 0) {
      alert('Por favor sube al menos una imagen para personalizar tu producto');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadResults: UploadedFile[] = [];
      
      // Subir imágenes solo si hay archivos
      if (form.images.length > 0) {
        uploadResults = await uploadFilesToServer();
        setUploadedFiles(uploadResults);
      }

      // Llamar a la función onSubmit con todos los datos
      onSubmit({ 
        ...form, 
        uploadedFiles: uploadResults 
      });

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const selectImage = (index: number) => {
    if (index >= form.images.length) return;

    setSelectedImageIndex(index);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) setPreview(reader.result as string);
    };
    reader.readAsDataURL(form.images[index]);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de vista previa */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Vista previa de tu diseño</h3>
          <div className="relative aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <Image 
                  src={product.image} 
                  alt="Producto original" 
                  layout="fill"
                  objectFit="contain"
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">Color:</p>
              <p className="font-semibold text-gray-800">{form.color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Talla:</p>
              <p className="font-semibold text-gray-800">{form.size}</p>
            </div>
          </div>
          {form.images.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 text-gray-700">Diseños subidos:</p>
              <div className="flex flex-wrap gap-3">
                {form.images.map((file, index) => (
                  <div 
                    key={index} 
                    className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImageIndex === index 
                        ? 'border-indigo-600 shadow-md' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => selectImage(index)}
                  >
                    <Image 
                      src={URL.createObjectURL(file)} 
                      alt={`Diseño ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 text-gray-700">Diseños confirmados:</p>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Subida ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Formulario de personalización */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Personaliza tu {product.name}</h2>
            <div className="flex items-center">
              <span className="text-gray-500 line-through mr-2">${product.price}</span>
              <span className="text-xl font-bold text-indigo-600">${product.basePrice}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, size }))}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        form.size === size
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        form.color === color 
                          ? 'border-indigo-600 shadow-md scale-110' 
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: color === 'Blanco' ? '#ffffff' : 
                          color === 'Negro' ? '#000000' : 
                          color === 'Gris' ? '#9ca3af' : 
                          color === 'Azul' ? '#3b82f6' : 
                          color === 'Rojo' ? '#ef4444' : 
                          color === 'Azul Marino' ? '#1e3a8a' : 
                          color === 'Verde Oliva' ? '#4d7c0f' : 
                          color === 'Natural' ? '#d6d3d1' : 
                          color === 'Rosa' ? '#f472b6' : '#3b82f6'
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600 font-medium">{form.color}</p>
              </div>
            )}
            {product.customizationOptions?.type !== 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto personalizado {product.customizationOptions?.maxTextLength && 
                    <span className="text-gray-500">(max {product.customizationOptions.maxTextLength} caracteres)</span>}
                </label>
                <input
                  type="text"
                  name="text"
                  value={form.text}
                  onChange={handleInputChange}
                  maxLength={product.customizationOptions?.maxTextLength}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                  placeholder="Ingresa el texto que deseas imprimir"
                />
              </div>
            )}
            {product.customizationOptions?.type !== 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diseños para imprimir {product.customizationOptions?.maxImages && product.customizationOptions?.maxImages > 1 && 
                    <span className="text-gray-500">(máximo {product.customizationOptions.maxImages})</span>}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={product.customizationOptions?.imageTypes?.join(',') || 'image/*'}
                  onChange={handleImageChange}
                  multiple={(product.customizationOptions?.maxImages || 1) > 1}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-all bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                      <FaUpload className="text-indigo-600 text-2xl" />
                    </div>
                    <p className="text-gray-700 font-medium">Haz clic para subir tus diseños</p>
                    <p className="text-xs text-gray-500 mt-2 max-w-md">
                      Formatos: {product.customizationOptions?.imageTypes?.map(t => t.split('/')[1].toUpperCase()).join(', ') || 'Cualquier imagen'}
                      {product.customizationOptions?.maxImageSize && 
                        ` (max ${product.customizationOptions.maxImageSize}MB cada una)`}
                    </p>
                  </div>
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                placeholder="¿Algún detalle especial para tu pedido?"
                rows={3}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar pedido personalizado'
                )}
              </button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get('productId');
  const productId = productIdParam ? parseInt(productIdParam, 10) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Usar variable de entorno para el número de WhatsApp
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || whatsapp[0].number;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    async function loadProduct() {
      setLoading(true);
      try {
        if (productId !== null) {
          const fetchedProduct = await fetchProductoTiendaPorId(productId);
          setProduct({
            id: typeof productId === 'number' ? productId : Number(productId),
            name: fetchedProduct.name,
            price: fetchedProduct.price ?? 0,
            basePrice: fetchedProduct.basePrice ?? 0,
            customizable: fetchedProduct.customizable,
            image: fetchedProduct.image,
            sizes: fetchedProduct.sizes,
            colors: fetchedProduct.colors,
            customizationOptions: fetchedProduct.customizationOptions
              ? {
                  type: Array.isArray(fetchedProduct.customizationOptions.type)
                    ? (fetchedProduct.customizationOptions.type[0] as 'text' | 'image')
                    : (fetchedProduct.customizationOptions.type as 'text' | 'image'),
                  maxTextLength: fetchedProduct.customizationOptions.maxTextLength ?? undefined,
                  maxImages: fetchedProduct.customizationOptions.maxImages ?? undefined,
                  imageTypes: undefined, // Ajusta esto si tu API lo provee
                  maxImageSize: fetchedProduct.customizationOptions.maxImageSize ?? undefined,
                }
              : undefined,
          });
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleSubmit = (formData: CustomizationForm) => {
    // Construir mensaje para WhatsApp
    let message = `¡Hola! 👋 Quiero personalizar mi ${product?.name}\n\n`;
    message += `📏 *Talla:* ${formData.size}\n`;
    message += `🎨 *Color:* ${formData.color}\n`;
    
    if (formData.text) {
      message += `✏️ *Texto personalizado:* ${formData.text}\n`;
    }
    
    if (formData.notes) {
      message += `📝 *Notas:* ${formData.notes}\n`;
    }
    
    message += `\n🛒 *Producto:* ${product?.name}`;
    message += `\n💰 *Precio base:* $${product?.price}`;
    message += `\n⭐ *Precio con descuento:* $${product?.basePrice}`;
    
    // Agregar URLs de imágenes
    if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
      message += `\n\n🖼️ *Diseños subidos:*\n`;
      formData.uploadedFiles.forEach((file, index) => {
        message += `Diseño ${index + 1}: ${file.url}\n`;
      });
    }

    // Codificar y abrir WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-red-600">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FaArrowLeft className="mr-2" />
          Volver a la tienda
        </Link>
      </div>
      <ProductCustomizer product={product} onSubmit={handleSubmit} />
    </div>
  );
}