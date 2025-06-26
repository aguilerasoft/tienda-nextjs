'use client'
import { useState, useEffect } from 'react';
import { fetchCategoria } from '@/services/api';
import type { Categoria } from '@/services/api';


export default function Categoria() {
    const [categorias, setProductos] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerCategoria = async () => {
            try {
                const data = await fetchCategoria();
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los categorias');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        obtenerCategoria();
    }, []);

    if (loading) return <div>Cargando categorias...</div>;
    if (error) return <div>{error}</div>;
    if (categorias.length === 0) return <div>No hay categorias disponibles</div>;

    return (
        <div>
            <h1>Listado de Categorias</h1>
            <ul>
                {categorias.map((talla) => (
                    <li key={talla.id || talla.name}>
                        <h2>{talla.name}</h2>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}