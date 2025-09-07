import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { presign } from '../../handlers/media';
import { Community } from '../../lib/type';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: Community['userId']
    }
}>, reply: FastifyReply): Promise<void> {
    try {
        const communities = await prisma.$transaction(async (transaction) => {
            const _communityWithUser = await transaction.community.findMany({
                where: {
                    user_id: request['params']['userId'],
                    deleted_at: null
                },
                orderBy: {
                    id: 'desc'
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    like_count: true,
                    media_id: true,
                    user_id: true,
                    media: { 
                        select: { 
                            id: true, 
                            key: true, 
                            type: true 
                        } 
                    },
                }
            });
            if (_communityWithUser === null) {
                throw new BadRequest('Params["userId"] must be valid');
            }

            const communityWithMedia = await Promise.all(
                _communityWithUser.map(async (community) => {
                    const url = community['media']?.['key'] ? await presign(community['media']['key'], 300) : null;

                    return {
                    id: community['id'],
                    title: community['title'],
                    content: community['content'],
                    like_count: community['like_count'],
                    user_id: community['user_id'],
                    media: community['media']
                        ? {
                            id: community['media']['id'],
                            type: community['media']['type'],
                            url, 
                        }
                        : null,
                    };
                })
            );
            return communityWithMedia;


        });
        reply.status(200)
            .send({communities});
    }
    catch(err) {
        throw err;
    }
}
