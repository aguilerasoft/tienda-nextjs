// Productos
  export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    basePrice: number;
    category: string;
    image: string;
    customizable: boolean;
    sizes: string[];
    colors: string[];
    customizationOptions: {
      type: 'both' | 'text' | 'image';
      maxTextLength?: number;
      maxImages?: number;
      imageTypes?: string[];
      maxImageSize?: number;
    };
  }
  export const products: Product[] = [
    {
      id: 1,
      name: 'Camiseta Básica',
      description: 'Camiseta 100% algodón para personalización',
      price: 19.99,
      basePrice: 14.99,
      category: 'camisetas',
      image: '/image/camisa.png',
      customizable: true,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'],
      customizationOptions: {
        type: 'both',
        maxTextLength: 50,
        maxImages: 2,
        imageTypes: ['image/png', 'image/jpeg'],
        maxImageSize: 5
      }
    },
    {
      id: 2,
      name: 'Sudadera con Capucha',
      description: 'Sudadera premium para personalizar',
      price: 39.99,
      basePrice: 29.99,
      category: 'sudaderas',
      image: '/image/camisa.png',
      customizable: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Gris', 'Azul Marino', 'Verde Oliva'],
      customizationOptions: {
        type: 'both',
        maxTextLength: 30,
        maxImages: 1,
        imageTypes: ['image/png', 'image/jpeg'],
        maxImageSize: 3
      }
    },
    {
      id: 3,
      name: 'Gorra Ajustable',
      description: 'Gorra de alta calidad para diseño personalizado',
      price: 24.99,
      basePrice: 19.99,
      category: 'accesorios',
      image: '/image/camisa.png',
      customizable: true,
      sizes: ['Única'],
      colors: ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde'],
      customizationOptions: {
        type: 'image',
        maxImages: 1,
        imageTypes: ['image/png'],
        maxImageSize: 2
      }
    },
    {
      id: 4,
      name: 'Tote Bag',
      description: 'Bolsa de tela personalizable',
      price: 14.99,
      basePrice: 9.99,
      category: 'accesorios',
      image: '/image/camisa.png',
      customizable: true,
      sizes: ['Única'],
      colors: ['Natural', 'Negro', 'Azul', 'Rosa'],
      customizationOptions: {
        type: 'both',
        maxTextLength: 40,
        maxImages: 1,
        imageTypes: ['image/png', 'image/jpeg'],
        maxImageSize: 3
      }
    },
    {
        id: 5,
        name: 'Tote Bag pruebaaaa',
        description: 'Bolsa de tela personalizable',
        price: 14.99,
        basePrice: 9.99,
        category: 'accesorios',
        image: '/image/camisa.png',
        customizable: true,
        sizes: ['Única', 'NADAAAAAA'],
        colors: ['Natural', 'Negro', 'Azul', 'Rosa', 'nada'],
        customizationOptions: {
          type: 'bothss',
          maxTextLength: 40,
          maxImages: 1,
          imageTypes: ['image/png', 'image/jpeg'],
          maxImageSize: 3
        }
      }
  ];


// Categoria
  export interface Categoria {
    id: string;
    name: string;
   

  }
  export const categories: Categoria[] = [
    { id: 'todos', name: 'Todos' },
    { id: 'camisetas', name: 'Camisetas' },
    { id: 'sudaderas', name: 'Sudaderas' },
    { id: 'accesorios', name: 'Accesorios' },
  ];


// Whatsapp

export interface Whatsapp{
    number: string;
}

export const whatsapp: Whatsapp[] = [

    {number: '584127051642'},

];