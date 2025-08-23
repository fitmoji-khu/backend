import { FastifyReply, FastifyRequest } from 'fastify';
import { parseBearer, verifyAccessToken } from '../lib/jsonwebtoken';
import { BadRequest, Unauthorized } from '../lib/httpError';

export default async function authHandler(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const token = parseBearer(request['headers']['authorization']);
    if (token === null) {
        reply.send(new BadRequest('Authroization value must be valid json web token'));
        return;
    }

    const payload = await verifyAccessToken(token); 
    const uid = Number.parseInt(payload['sub']);
    
    if (!Number.isFinite(uid)) {
        reply.send(new BadRequest('Authroization value must be valid json web token'));
        return;
    }

    (request as any).userId = uid; 
}