import { FastifyReply, FastifyRequest } from 'fastify';
import { Closet } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Body: Pick<Closet, 'label' | 'accuracy' | 'mediaId'>;
}>, reply: FastifyReply): Promise<void> {
    try {
        const closet = await prisma.$transaction(async (transaction): Promise<{ id: number }> => {
            const media = await transaction.media.findFirst({
                where: {
                    id: request['body']['mediaId'],
                },
                select: {
                    id: true
                }
            });
            if (media === null) {
                throw new BadRequest('Body["mediaId"] must be valid');
            }

            return transaction.closet.create({
                data: {
                    user_id: request['userId'],
                    label: request['body']['label'],
                    accuracy: request['body']['accuracy'],
                    media_id: request['body']['mediaId']
                },
                select: {
                    id: true
                }
            });
        });
        reply.status(201)
            .send(closet['id']);
    }
    catch(err) {
        throw err;
    }
}
