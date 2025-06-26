import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    // Crear directorio de uploads si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Leer el archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validar y preparar la clave de encriptación
    let secretKey = process.env.CRYPTO_SECRET || 'default-secret-key';
    
    // Asegurarnos de que la clave tenga exactamente 32 bytes
    if (secretKey.length < 32) {
      // Rellenar con caracteres adicionales si es demasiado corta
      secretKey = secretKey.padEnd(32, '0');
    } else if (secretKey.length > 32) {
      // Truncar si es demasiado larga
      secretKey = secretKey.slice(0, 32);
    }
    
    // Convertir a Buffer de 32 bytes
    const keyBuffer = Buffer.alloc(32);
    keyBuffer.write(secretKey, 0, 32, 'utf-8');

    // Generar IV (vector de inicialización)
    const iv = crypto.randomBytes(16);
    
    // Crear el cifrador
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Cifrar el nombre del archivo
    let encrypted = cipher.update(file.name, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combinar IV y texto cifrado
    const encryptedName = `${iv.toString('hex')}:${encrypted}`;
    const fileExtension = path.extname(file.name);
    const newFileName = `${encryptedName}${fileExtension}`;
    const filePath = path.join(uploadDir, newFileName);

    // Guardar el archivo
    await fs.promises.writeFile(filePath, buffer);

    // Crear URL pública
    const publicUrl = `/uploads/${newFileName}`;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      encryptedName: newFileName,
      downloadUrl: publicUrl,
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}