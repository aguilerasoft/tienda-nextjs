export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    customizable: boolean;
    sizes?: string[];
    colors?: string[];
    basePrice: number;
    customizationOptions?: {
      type: 'text' | 'image' | 'both';
      maxTextLength?: number;
      maxImages?: number;
      imageTypes?: string[];
      maxImageSize?: number; // in MB
    };
  }
  
  export interface CustomizationForm {
    productId: number;
    size: string;
    color: string;
    text?: string;
    images: File[];
    notes: string;
  }