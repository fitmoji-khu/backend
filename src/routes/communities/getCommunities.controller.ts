import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { presign } from '../../handlers/media';

export default async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const communities = await prisma.$transaction(async (transaction) => {
            const _communities = await transaction.community.findMany({
                where: {
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

            const communityWithMedia = await Promise.all(
                _communities.map(async (community) => {
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