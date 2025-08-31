import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { presign } from '../../handlers/media';

export default async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const closets = await prisma.$transaction(async (transaction): Promise<{ id: number; label: string; accuracy: number; media: { id: number; type: string; url: string; } | null; }[]> => {
            const _closetsWithMedias = await transaction.closet.findMany({
                where: {
                    user_id: request['userId'],
                    deleted_at: null
                },
                select: {
                    id: true,
                    label: true,
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
                _closetsWithMedias.map(async (closet): Promise<{ id: number; label: string; accuracy: number; media: { id: number; type: string; url: string; } | null;}> => {
                    // if (closets.media === null) { }
                    const url = await presign(closet.media.key, 300);
                    return {
                        id: closet['id'],
                        label: closet['label'],
                        accuracy: closet['accuracy'],
                        media: {
                            id: closet['media']['id'],
                            type: closet['media']['type'],
                            url,
                        },
                    };
                })
            );
            return _closets;
        });
        reply.code(200)
            .send(closets);
    }
    catch(err) {
        throw err;
    }
}
