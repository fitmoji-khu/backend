import { randomUUID } from 'crypto';
import { BadRequest, Unauthorized } from '../lib/httpError';

export const ALLOWED_MIME_TYPE = new Set(['image/jpeg','image/png','image/webp']);

export function verifyMimeType(mimeType: string) {
    if (!ALLOWED_MIME_TYPE.has(mimeType)) {
        const types = Array.from(ALLOWED_MIME_TYPE).join(', ');
        throw new BadRequest(`unsupported content-type (allowed: ${types})`);
    }
}

export function buildKey(userId: number) {
    if (!userId) {
        throw new Unauthorized('userId is required for buildKey');
    }
    return `${userId}/${crypto.randomUUID()}`;
}