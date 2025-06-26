'use client'

import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from './ImageUploader';
import { Product, CustomizationForm } from '../lib/types';

interface ProductCustomizerProps {
  product: Product;
  onSubmit: (form: CustomizationForm) => void;
}

export default function ProductCustomizer({ product, onSubmit }: ProductCustomizerProps) {
  const [form, setForm] = useState<Omit<CustomizationForm, 'productId'>>({
    size: product.sizes?.[0] || '',
    color: product.colors?.[0] || '',
    text: '',
    images: [],
    notes: ''
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setForm(prev => ({ ...prev, images: files }));
    
    // Generate preview if there's at least one image
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({
      productId: product.id,
      ...form
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Vista previa de tu diseño</h3>
          
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {preview ? (
              <Image 
                src={preview} 
                alt="Previsualización del diseño" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center p-8">
                <p>Tu diseño aparecerá aquí</p>
                {product.customizationOptions?.type !== 'image' && (
                  <p className="mt-4 text-lg font-medium">{form.text || 'Texto de ejemplo'}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Color:</p>
              <p className="font-medium">{form.color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Talla:</p>
              <p className="font-medium">{form.size}</p>
            </div>
          </div>
        </div>

        {/* Customization Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Personaliza tu {product.name}</h2>
          <p className="text-gray-600 mb-6">Precio base: ${product.basePrice.toFixed(2)}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  name="color"
                  value={form.color}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  {product.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            {product.customizationOptions?.type !== 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto personalizado {product.customizationOptions?.maxTextLength && 
                    `(max ${product.customizationOptions.maxTextLength} caracteres)`}
                </label>
                <input
                  type="text"
                  name="text"
                  value={form.text}
                  onChange={handleInputChange}
                  maxLength={product.customizationOptions?.maxTextLength}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingresa el texto que deseas imprimir"
                />
              </div>
            )}

            {product.customizationOptions?.type !== 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imágenes para imprimir {product.customizationOptions?.maxImages && 
                    `(max ${product.customizationOptions.maxImages})`}
                </label>
                <ImageUploader
                  maxFiles={product.customizationOptions?.maxImages || 1}
                  acceptedTypes={product.customizationOptions?.imageTypes || ['image/png', 'image/jpeg']}
                  maxSize={product.customizationOptions?.maxImageSize || 5}
                  onFilesChange={handleImagesChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Indica cualquier detalle adicional para tu pedido"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar pedido por WhatsApp'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}