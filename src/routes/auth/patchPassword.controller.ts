import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { User } from '../../lib/type';
import { hashPassword } from '../../lib/bcrypt';
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: User['id'];
    };
    Body: {
        password: User['password'];
    };
}>, reply: FastifyReply): Promise<void> {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const _user = await transaction.user.findFirst({
            where: {
                id: request['params']['userId']
            }
        });

        if (_user === null) {
            throw new BadRequest('Params["userId"] must be valid');
        }

        if (request['params']['userId'] !== request['userId']) {
            throw new Unauthorized('Params["userId"] must be yourself');
        }

        const hashed = await hashPassword(request['body']['password']);

        await transaction.user.update({
            where: {
                id: request['params']['userId']
            },
            data:  { 
                password: hashed
            }
        });

        reply.status(204)
            .send();
    });
}