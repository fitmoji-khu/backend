import bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.SALT_ROUNDS ?? process.env.DEFAULT_ROUNDS);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
}