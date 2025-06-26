


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