import { FastifyReply, FastifyRequest } from 'fastify';
import { Reactions } from '../../../lib/type';
import { prisma } from '../../../lib/prisma';
import { BadRequest } from '../../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: Reactions['communityId'];
        reactionId: Reactions['id'];
    }
}>, reply: FastifyReply): Promise<void> {
    try {
        await prisma.$transaction(async (transaction) => {
            const communityWithReations = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
                },
                select: {
                    reactions: {
                        where: {
                            user_id: request['userId'],
                            deleted_at: null
                        },
                        select: { id: true },
                    }
                }
            });
            if (communityWithReations === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            if (communityWithReations['reactions'].length === 0) {
                throw new BadRequest('Already reacted with this emoji');
            }

            await transaction.reactions.update({
                where: {
                    id: request['params']['reactionId'],
                    community_id: request['params']['communityId'],
                    user_id: request['userId']
                },
                data: {
                    deleted_at: new Date()
                }
            });

            await transaction.community.update({
                where: {
                    id: request['params']['communityId'],
                },
                data: { 
                    like_count: { 
                        decrement: 1
                    } 
                }
            });
        })
        reply.status(204).send();
    }
    catch(err) {
        throw err;
    }
}