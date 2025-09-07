import { FastifyReply, FastifyRequest } from 'fastify';
import { Reactions } from '../../../lib/type';
import { prisma } from '../../../lib/prisma';
import { BadRequest } from '../../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: Reactions['communityId'];
    }
    Body: {
        emoji: Reactions['emoji'];
    };
}>, reply: FastifyReply): Promise<void> {
    try {
        const reaction = await prisma.$transaction(async (transaction) => {
            const communityWithReations = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
                },
                select: {
                    like_count: true,
                    reactions: {
                        where: {
                            user_id: request['userId'],
                            emoji: request['body']['emoji'],     
                            deleted_at: null
                        },
                        select: { id: true },
                    }
                }
            });
            if (communityWithReations === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            if (communityWithReations['reactions'].length > 0) {
                throw new BadRequest('Already reacted with this emoji');
            }

            const _reaction = await transaction.reactions.create({
                data: {
                    community_id: request['params']['communityId'],
                    user_id: request['userId'],
                    emoji: request['body']['emoji']
                },
                select: {
                    id: true
                }
            });

            await transaction.community.update({
                where: {
                    id: request['params']['communityId'],
                },
                data: { 
                    like_count: { 
                        increment: 1 
                    } 
                }
            });
            return _reaction;
        })
        reply.status(201).send(reaction);
    }
    catch(err) {
        throw err;
    }
}