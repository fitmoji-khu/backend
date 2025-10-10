import { FastifyReply, FastifyRequest } from 'fastify';
import { Closet } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        closetId: Closet['id'];
    };
    Body: Partial<Pick<Closet, 'upperCategory' | 'lowerCategory' | 'mediaId' | 'color'>>;
}>, reply: FastifyReply): Promise<void> {
    try {
        await prisma.$transaction(async (transaction): Promise<void> => {
            const closet = await transaction.closet.findFirst({
                where: {
                    id: request['params']['closetId'],
                    deleted_at: null
                },
                select: {
                    user_id: true,
                }
            });
            if (closet === null) {
                throw new BadRequest('Params["closetId"] must be valid');
            }

            if (closet['user_id'] !== request['userId']) {
                throw new Unauthorized('Request ["userId"] must be self');
            }
            
            const media = await transaction.media.findFirst({
                where: {
                    id: request['body']['mediaId'],
                    deleted_at: null
                }
            });
            if (media === null) {
                throw new BadRequest('Body["mediaId"] must be valid');
            }

            await transaction.closet.update({
                where: {
                    id: request['params']['closetId'],
                    user_id: request['userId']
                },
                data: {
                    upper_category: request['body']['upperCategory'],
                    lower_category: request['body']['lowerCategory'],
                    media_id: request['body']['mediaId'],
                    color: request['body']['color']
                }
            });
        });
        reply.status(204).send();
    }
    catch(err) {
        throw err;
    }
}
