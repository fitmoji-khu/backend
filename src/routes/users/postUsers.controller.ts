import { FastifyReply, FastifyRequest } from 'fastify';
import { User, UserInfo } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/bcrypt';

export default async function (request: FastifyRequest<{
    Body: Pick<User, 'email' | 'password' | 'name' > & 
        Pick<UserInfo, 'personalColor' | 'style' | 'height' | 'weight' | 'gender' | 'birthAt'>;
}>, reply: FastifyReply): Promise<void> {
    try {
        const user = await prisma.$transaction(async (transaction): Promise<{ id: number }> => {
            const hashed = await hashPassword(request['body']['password']);

            const _user = await transaction.user.create({
                data: {
                    email: request['body']['email'],
                    password: hashed,
                    name: request['body']['name'],
                    media_id: null
                },
                select: {
                    id: true
                }
            });

            await transaction.user_info.create({
                data: {
                    user_id: _user['id'],
                    personal_color: request['body']['personalColor'],
                    style: request['body']['style'],
                    height: request['body']['height'],
                    weight: request['body']['weight'],
                    gender: request['body']['gender'],
                    birth_at: new Date(request['body']['birthAt'] as unknown as string),
                }
            });

            return _user;
        });
        reply.status(201)
            .send(user);
    } catch(err) {
        throw err;
    }
}
