import { FastifyReply, FastifyRequest } from 'fastify';
import { Community } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Body: Pick<Community, 'title' | 'content' | 'mediaId'>;
}>, reply: FastifyReply): Promise<void> {
    try {
        const community = await prisma.$transaction(async (transaction): Promise<{ id: number }> => {
            if (request['body']['mediaId'] !== null) {
                const media = await transaction.media.findFirst({
                    where: {
                        id: request['body']['mediaId'],
                    }
                });
                if (media === null) {
                    throw new BadRequest('Body["mediaId"] must be valid');
                }
            }

            return transaction.community.create({
                data: {
                    title: request['body']['title'],
                    content: request['body']['content'],
                    user_id: request['userId'],
                    media_id: request['body']['mediaId'],
                },
                select: {
                    id: true
                }
            });
        });
        reply.status(201)
            .send(community['id']);
    }
    catch(err) {
        throw err;
    }
}
