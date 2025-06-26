'use client'
import { useState, useEffect } from 'react';
import { fetchTalla } from '@/services/api';
import type { Talla } from '@/services/api';

export default function Talla() {
    const [tallas, setProductos] = useState<Talla[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerTalla = async () => {
            try {
                const data = await fetchTalla();
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los tallas');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        obtenerTalla();
    }, []);

    if (loading) return <div>Cargando tallas...</div>;
    if (error) return <div>{error}</div>;
    if (tallas.length === 0) return <div>No hay tallas disponibles</div>;

    return (
        <div>
            <h1>Listado de Tallas</h1>
            <ul>
                {tallas.map((talla) => (
                    <li key={talla.id || talla.name}>
                        <h2>{talla.name}</h2>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}