import { BadRequest, Unauthorized } from '../lib/httpError';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, BUCKET } from '../lib/s3';

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

export function presign(key: string, expiresInSec = 300) {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3, cmd, { expiresIn: expiresInSec });
}
