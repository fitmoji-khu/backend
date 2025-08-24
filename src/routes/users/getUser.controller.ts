import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { User } from '../../lib/type';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: User['id'];
    };
}>, reply: FastifyReply) {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const user = await transaction.user.findFirst({
            where: {
                id: request['userId'],
                deleted_at: null
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true
            }
        });

        if (user === null) {
            throw new BadRequest('Params["userId"] must be valid');
        }

        const userInfo = await transaction.user_info.findFirst({
            where: {
                user_id: request['userId']
            },
            select: {
                personal_color: true,
                style: true,
                height: true,
                weight: true,
                gender: true,
                birth_at: true,
            }
        });

        if (userInfo === null) {
            throw new BadRequest('Params["userId"] must be valid');
        }

        reply.send({
            user: user,
            userInfo: userInfo
        });
    });
}