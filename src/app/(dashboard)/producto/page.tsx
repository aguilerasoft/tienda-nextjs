'use client'
import { useState, useEffect } from 'react';
import { fetchProducto } from '@/services/api';
import type { Producto } from '@/services/api';

export default function Nuevo() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const data = await fetchProducto();
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los productos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        obtenerProductos();
    }, []);

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>{error}</div>;
    if (productos.length === 0) return <div>No hay productos disponibles</div>;

    return (
        <div>
            <h1>Listado de Productos</h1>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id || producto.name}>
                        <h2>{producto.name}</h2>
                        <p>{producto.description}</p>
                        <p>Precio: ${producto.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}