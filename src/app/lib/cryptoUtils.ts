import crypto from 'crypto';

const secretKey = process.env.CRYPTO_SECRET || 'mi-clave-secreta-32bytes-123456789012';

export function encryptFileName(originalName: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', 
    Buffer.from(secretKey.slice(0, 32)), iv);
  
  let encrypted = cipher.update(originalName, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptFileName(encryptedName: string): string {
  const [ivHex, encrypted] = encryptedName.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', 
    Buffer.from(secretKey.slice(0, 32)), iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}