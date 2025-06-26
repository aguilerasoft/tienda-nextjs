"use server"

//Producto Tienda
export interface ProductoTienda {
    colors: string[];
    sizes: string[];
    customizationOptions: {
        maxTextLength: number | null;
        maxImages: number | null;
        maxImageSize: number | null;
        type: string[];
    };
    name: string;
    description: string;
    price: number | null;
    basePrice: number | null;
    image: string;
    customizable: boolean;
    categoria: string;
    id: number;
}
export async function fetchProductoTienda(): Promise<ProductoTienda[]> {


    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/productos/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: ProductoTienda[] = await res.json();


    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    return data;
}
export async function fetchProductoTiendaPorId(id: string | number): Promise<ProductoTienda> {
    // URL de la API para un producto específico
    const apiUrl = `${process.env.API_URL_BASE}/api/productos/${id}/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar producto (ID ${id}): ${res.status} - ${errorText}`);
    }

    const data: ProductoTienda = await res.json();
    return data;
}
/// Categoria Tienda
export interface CategoriaTienda {
    id: number;
    name: string;
    
}
export async function fetchCategoriaTienda(): Promise<CategoriaTienda[]> {
 

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/categorias/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: CategoriaTienda[] = await res.json();


    return data;
}
