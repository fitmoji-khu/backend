import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jsonwebtoken';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Body: {
        refreshToken: string;
    };
}>, reply: FastifyReply): Promise<void> {
    try {
        const token = await prisma.$transaction(async (transaction): Promise<{ accessToken: string, refreshToken: string }> => {
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

            return { accessToken, refreshToken }
        });
        reply.status(201)
            .send({
                token: {
                    access: token['accessToken'],
                    refresh: token['refreshToken']
                }
            });
    } catch(err) {
        throw err;
    }
}