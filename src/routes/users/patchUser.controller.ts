import { FastifyRequest, FastifyReply } from "fastify";
import { User } from '../../lib/type';
import { prisma } from "../../lib/prisma";
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: User['id'];
    };
    Body: {
        name: User['name'];
    };
}>, reply: FastifyReply) {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const _user = await transaction.user.findFirst({
            where: {
                id: request['params']['userId']
            },
            select: {
                password: true,
                name: true
            }
        });

        if (_user === null) {
            throw new BadRequest('Params["userId"] must be valid');
        }
        
        if (request['params']['userId'] !== request['userId']) {
            throw new Unauthorized('Params["userId"] must be yourself');
        }
        
        if (_user['name'] === request['body']['name']) {
            throw new BadRequest('Body["name"] is same previous password');
        }

        await transaction.user.update({
            where: {
                id: request['params']['userId']
            },
            data:  { 
                name: request['body']['name'] 
            }
        });

        reply.status(204)
            .send();
    });
}