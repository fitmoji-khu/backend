import * as jose from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

type TokenPayload = Record<string, unknown> & { 
    sub: string; 
    type: 'access' | 'refresh' 
    iat?: number;
    exp?: number; 
};

export async function signAccessToken(
    userId: number, 
    exp: "15m"
): Promise<string> {
    return await new jose.SignJWT({ 
        sub: String(userId), 
        type: 'access' 
    } satisfies TokenPayload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(key);
}

export async function signRefreshToken(
    userId: number, 
    exp: "7d"
): Promise<string> {
    return await new jose.SignJWT({ 
        sub: String(userId), 
        type: 'refresh' 
    } satisfies TokenPayload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(key);
}

export async function verifyAccessToken(
    token: string
): Promise<TokenPayload> {
    const { payload } = await jose.jwtVerify(token, key);

    if (payload.type !== 'access') { 
        throw new Error('');
    }
    if (typeof payload.sub !== 'string') {
        throw new Error('');
    }
    return payload as TokenPayload;
}

export async function verifyRefreshToken(
    token: string
): Promise<TokenPayload> {
    const { payload } = await jose.jwtVerify(token, key);

    if (payload.type !== 'refresh') { 
        throw new Error('');
    }

    if (typeof payload.sub !== 'string') { 
        throw new Error('');
    }
    return payload as TokenPayload;
}

export function parseBearer(
    header?: string
): string | null {
    if (!header || !header.startsWith('Bearer ')) return null;
    return header.slice(7);
}