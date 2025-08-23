import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jsonwebtoken';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Body: {
        refreshToken: string;
    };
}>, reply: FastifyReply): Promise<void> {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const user = await transaction.user.findFirst({
            where: {
                id: request['userId'],
                deleted_at: null
            }
        })
        if (user === null) {
            throw new BadRequest('Request["userId"] must be valid');
        }
        
        const payload = await verifyRefreshToken(request['body']['refreshToken']);
        const userId = Number.parseInt(payload['sub']);

        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(userId, '15m'),
            signRefreshToken(userId, '7d')
        ]);

        reply.status(201)
            .send({
                token: {
                    access: accessToken,
                    refresh: refreshToken
                }
            });
    });
}