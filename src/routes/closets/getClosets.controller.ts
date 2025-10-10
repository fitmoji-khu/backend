import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { presign } from '../../handlers/media';

export default async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const closets = await prisma.$transaction(async (transaction) => {
            const _closetsWithMedias = await transaction.closet.findMany({
                where: {
                    user_id: request['userId'],
                    deleted_at: null
                },
                select: {
                    id: true,
                    upper_category: true,
                    lower_category: true,
                    color: true,
                    accuracy: true,
                    media: {
                        select: {
                            id: true,
                            key: true,
                            type: true
                        }
                    }
                },
                orderBy: { 
                    id: 'desc' 
                },
            });

            const _closets = await Promise.all(
                _closetsWithMedias.map(async (closet) => {
                    // if (closets.media === null) { }
                    const url = await presign(closet.media.key, 300);
                    return {
                        id: closet['id'],
                        upperCategory: closet['upper_category'],
                        lowerCategory: closet['lower_category'],
                        color: closet['color'],
                        accuracy: closet['accuracy'],
                        media: {
                            id: closet['media']['id'],
                            type: closet['media']['type'],
                            url,
                        },
                    };
                })
            )
            return _closets;
        });
        reply.code(200)
            .send(closets);
    }
    catch(err) {
        throw err;
    }
}
