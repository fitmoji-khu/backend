import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { Community } from '../../lib/type';
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: Community['id'];
    };
}>, reply: FastifyReply): Promise<void> {
    try {
        await prisma.$transaction(async (transaction) => {
            const community = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
                },
                select: {
                    user_id: true
                }
            })
            if (community === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            if (community['user_id'] !== request['userId']) {
                throw new Unauthorized('Request ["userId"] must be self');
            }

            await transaction.community.update({
                where: {
                    id: request['params']['communityId'],
                    user_id: request['userId']
                },
                data: {
                    deleted_at: new Date()
                }
            })

        });
        reply.status(204).send();
    }
    catch(err) {
        throw err;
    }
}
