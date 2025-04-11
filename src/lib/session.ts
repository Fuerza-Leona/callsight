import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import { sessionSecret } from '@/constants';

const algorithm = 'aes-256-cbc';
const ivLength = 16;
const key = Buffer.from(sessionSecret!, 'hex'); // 32-byte key

export function encrypt(data: unknown): string {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encrypted: string): unknown {
  const [ivHex, encryptedHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedData = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString());
}
