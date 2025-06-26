"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


//// Registrar IP
export interface RegistrarIP {
    id: number;
    ip: string;
    code: string | null;
    idperson: string;
    created: string;
}



export async function fetchRegistrarIP(): Promise<RegistrarIP[]> {
    // Obtengo la sesión para extraer token (ajustar si el token está en otro lugar)
    const session = await getServerSession(authOptions);

    

    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BACKEND}/api/registrarip/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: RegistrarIP[] = await res.json();

    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    return data;
}
export const createRegistrarIP = async (data: { numero: number }): Promise<RegistrarIP> => {

     const session = await getServerSession(authOptions);

  

    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }
    const response = await fetch(`${process.env.API_URL_BACKEND}/api/registrarip/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(data),
    });

    console.log(response)

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

/// Producto
export interface Producto {
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
}
export async function fetchProducto(): Promise<Producto[]> {
    // Obtengo la sesión para extraer token (ajustar si el token está en otro lugar)
    const session = await getServerSession(authOptions);

 

    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/productos/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: Producto[] = await res.json();


    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    return data;
}

/// Talla
export interface Talla {
    
    name: string;
    
}
export async function fetchTalla(): Promise<Talla[]> {
    // Obtengo la sesión para extraer token (ajustar si el token está en otro lugar)
    const session = await getServerSession(authOptions);

    

    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/tallas/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: Producto[] = await res.json();

    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    return data;
}

/// Categoria
export interface Categoria {
    
    name: string;
 
    
}
export async function fetchCategoria(): Promise<Categoria[]> {
    // Obtengo la sesión para extraer token (ajustar si el token está en otro lugar)
    const session = await getServerSession(authOptions);


    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/categorias/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: Categoria[] = await res.json();

    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    console.log('adsasasasasa')
    console.log(data)

    return data;
}


/// Color
export interface Color {
    
    name: string;
    
}

export async function fetchColor(): Promise<Color[]> {
    // Obtengo la sesión para extraer token (ajustar si el token está en otro lugar)
    const session = await getServerSession(authOptions);

    

    if (!session) {
        throw new Error("Unauthorized: no session found");
    }

    // Asumimos que el token JWT está en session.accessToken o session.token, ajustar según configuración
    const token = (session as unknown as { user: { access: string } }).user.access;
    if (!token) {
        throw new Error("JWT token no disponible en la sesión");
    }

    // URL de la API Django Rest Framework que devuelve personas (ajustar URL)
    const apiUrl = `${process.env.API_URL_BASE}/api/colores/`;

    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        cache: "no-store", // no cache para obtener datos frescos
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al consultar API Django: ${res.status} - ${errorText}`);
    }

    const data: Producto[] = await res.json();

    // Opcional: revalidar cache para la ruta donde se muestran personas
    // revalidatePath("/personas");

    return data;
}