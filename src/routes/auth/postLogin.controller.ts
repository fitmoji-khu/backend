import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { verifyPassword } from '../../lib/bcrypt';
import { signAccessToken, signRefreshToken } from '../../lib/jsonwebtoken';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Body: Pick<User, 'email' | 'password'>;
}>, reply: FastifyReply): Promise<void> {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const user = await transaction.user.findFirst({
            where: {
                email: request['body']['email'],
                deleted_at: null
            },
            select: {
                id: true,
                password: true
            }
        });

        if (user === null) {
            throw new BadRequest('Body["email"] and Body["password"] must be valid');
        }

        const password = await verifyPassword(request['body']['password'], user['password']);
        if (password !== true) {
            throw new BadRequest('Body["password"] must be valid');
        }
        
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(user['id'], '15m'),
            signRefreshToken(user['id'], '7d')
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