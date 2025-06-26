import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opciones de configuración principales
  reactStrictMode: true,
  
  // Configuración de allowedDevOrigins (si es necesaria)
  // Nota: Esta opción no es estándar en Next.js, asegúrate que sea compatible
  allowedDevOrigins: [
    'http://172.17.2.131:3000',
    'http://localhost:3000',
  ],

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript durante la compilación
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint durante la compilación
  }
};

export default nextConfig;