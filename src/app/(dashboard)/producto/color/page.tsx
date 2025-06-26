'use client'
import { useState, useEffect } from 'react';
import { fetchColor } from '@/services/api';
import type { Color } from '@/services/api';

export default function Color() {
    const [colores, setProductos] = useState<Color[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerColor = async () => {
            try {
                const data = await fetchColor();
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los colores');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        obtenerColor();
    }, []);

    if (loading) return <div>Cargando colores...</div>;
    if (error) return <div>{error}</div>;
    if (colores.length === 0) return <div>No hay colores disponibles</div>;

    return (
        <div>
            <h1>Listado de Colores</h1>
            <ul>
                {colores.map((talla) => (
                    <li key={talla.id || talla.name}>
                        <h2>{talla.name}</h2>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}