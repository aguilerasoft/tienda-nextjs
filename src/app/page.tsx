'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { whatsapp } from '@/app/data-products';
import { fetchProductoTienda, fetchCategoriaTienda } from '@/services/apiTienda';
import type { ProductoTienda, CategoriaTienda } from '@/services/apiTienda';



export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductoTienda[]>([]);
  const [categories, setCategories] = useState<CategoriaTienda[]>([]);
  //const [loading, setLoading] = useState<boolean>(true);
  //const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [scrolled, setScrolled] = useState(false);
  const whatsappNumber = whatsapp[0].number;
  const whatsappMessage = encodeURIComponent('Hola, estoy interesado en personalizar un producto. ¿Me pueden ayudar?');

  
  console.log(selectedCategory)
  // Filtrar productos por categoría
  const filteredProducts = selectedCategory === 'Todos'
    ? products 
    : products.filter(product => product.categoria === selectedCategory);

  // Manejar clic en producto
  const handleProductClick = (productId: number) => {
  const product = filteredProducts.find(p => p.id === productId);
  if (product) {
    router.push(`/customize?productId=${productId}`);
  }
};

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const obtenerProductos = async () => {
        try {
            const data = await fetchProductoTienda();
            setProducts(data);
        } catch (err) {
            //setError('Error al cargar los productos');
            console.error(err);
        } finally {
            //setLoading(false);
        }
    };

    const obtenerCategoria = async () => {
      try {
          const data = await fetchCategoriaTienda();
          setCategories(data);

         


      } catch (err) {
          //setError('Error al cargar los productos');
          console.error(err);
      } finally {
          //setLoading(false);
      }
  };

    obtenerCategoria();

    obtenerProductos();
    
}, []);

console.log(products)
console.log(categories)

  return (
    <>
      <Head>
        <title>CustomWear - Personaliza tu ropa</title>
        <meta name="description" content="Tienda de personalización de ropa y accesorios" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-24 px-4">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-400">
                  CustomWear
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                Personaliza tu ropa y expresa tu estilo único con nuestras prendas de alta calidad
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                >
                  <span className="mr-2">Haz tu pedido por WhatsApp</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
                <button 
                  className="bg-transparent border-2 border-white hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({behavior: 'smooth'})}
                >
                  Ver productos
                </button>
              </div>
            </div>
          </div>
          
          {/* Olas decorativas */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-gray-50">
              <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Categorías */}
        <section id="products-section" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Nuestros <span className="text-indigo-600">Productos</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selecciona una categoría para ver nuestros productos personalizables
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } font-medium`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-gray-100 transform hover:-translate-y-2"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="flex-grow">
                  <div className="relative h-64 w-full group">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white font-medium">Ver detalles →</span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {product.categoria}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm line-through">${product.price}</p>
                        <p className="text-gray-900 font-bold text-lg">${product.basePrice}</p>
                      </div>
                      <div className="flex space-x-1">
                        {product.colors.slice(0, 3).map((color:any, index:any) => (
                          <div 
                            key={index} 
                            className="w-4 h-4 rounded-full border border-gray-200"
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
                          ></div>
                        ))}
                        {product.colors.length > 3 && (
                          <div className="text-xs text-gray-500 flex items-center">
                            +{product.colors.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Personalizar ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proceso de personalización */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Cómo <span className="text-indigo-600">personalizar</span> tu producto
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un proceso simple en 3 pasos para crear tus prendas personalizadas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  step: 1, 
                  title: "Elige tu producto", 
                  description: "Selecciona entre nuestra variedad de prendas y accesorios de alta calidad",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  )
                },
                { 
                  step: 2, 
                  title: "Diseña tu estilo", 
                  description: "Agrega tus gráficos, textos o combinaciones de colores con nuestra herramienta",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )
                },
                { 
                  step: 3, 
                  title: "Recibe tu pedido", 
                  description: "Te lo enviamos a tu domicilio o puedes recogerlo en nuestra tienda física",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )
                }
              ].map((step) => (
                <div 
                  key={step.step} 
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-transform hover:scale-[1.02]"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center">
                      <div className="text-indigo-600">
                        {step.icon}
                      </div>
                    </div>
                    <div className="text-indigo-600 text-3xl font-bold mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Lo que dicen <span className="text-indigo-600">nuestros clientes</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre la experiencia de quienes ya han personalizado sus prendas con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "María G.", 
                rating: 5, 
                comment: "La calidad de la camiseta superó mis expectativas. El diseño quedó perfecto y el proceso fue muy sencillo.",
                avatar: "MG"
              },
              { 
                name: "Carlos M.", 
                rating: 5, 
                comment: "Excelente servicio al cliente. Me ayudaron en todo el proceso de personalización y el resultado fue increíble.",
                avatar: "CM"
              },
              { 
                name: "Laura P.", 
                rating: 4, 
                comment: "El tiempo de entrega fue un poco largo, pero el producto final valió la pena. La calidad es excelente.",
                avatar: "LP"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.comment}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp flotante */}
        <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${scrolled ? 'scale-100' : 'scale-0'}`}>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 animate-bounce"
            aria-label="Contactar por WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>
        </div>
      </main>
    </>
  );
}