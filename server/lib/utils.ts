import { randomBytes } from 'crypto'

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex')
}

export function hashPassword(password: string): string {
  // Using Bun's built-in password hashing
  return Bun.password.hashSync(password)
}

export function verifyPassword(password: string, hash: string): boolean {
  return Bun.password.verifySync(password, hash)
}