import { FastifyReply, FastifyRequest } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function authHandler(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        reply.code(400).send({ message: "Authorization type must be Bearer" });
        return;
    }

    const token = authHeader.slice(7); 
    const secret = process.env.SECRET_KEY;

    if (secret === undefined) {
        reply.code(500).send({ message: "Server misconfiguration: missing JWT secret" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload & { userId?: number };

        if (decoded.userId === undefined) {
        reply.code(400).send({ message: "Invalid token payload" });
        return;
        }

        (request as any).userId = decoded.userId;
    } catch (err) {
        reply.code(401).send({ message: "Invalid or expired token" });
    }
}
