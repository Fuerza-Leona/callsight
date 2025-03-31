import { createCipheriv, randomBytes, createDecipheriv } from 'crypto'

const algorithm = 'aes-256-cbc'
const ivLength = 16
const key = Buffer.from(process.env.SESSION_SECRET!, 'hex') // 32-byte key

export function encrypt(data: any): string {
  const iv = randomBytes(ivLength)
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(encrypted: string): any {
  const [ivHex, encryptedHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedData = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(algorithm, key, iv)
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ])
  return JSON.parse(decrypted.toString())
}