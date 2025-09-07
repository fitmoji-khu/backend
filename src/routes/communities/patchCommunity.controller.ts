import { FastifyReply, FastifyRequest } from 'fastify';
import { Community } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: Community['id']
    };
    Body: Partial<Pick<Community, 'title' | 'content' | 'mediaId'>>;
}>, reply: FastifyReply): Promise<void> {
    try {
        await prisma.$transaction(async (transaction): Promise<void> => {
            const community = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
                },
                select: {
                    user_id: true,
                }
            });
            if (community === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            if (community['user_id'] !== request['userId']) {
                throw new Unauthorized('Request ["userId"] must be self');
            }

            if (typeof(request['body']['mediaId']) === 'number') {
                const media = await transaction.media.findFirst({
                    where: {
                        id: request['body']['mediaId'],
                        deleted_at: null
                    }
                });
                if (media === null) {
                    throw new BadRequest('Body["mediaId"] must be valid');
                }
            }

            await transaction.community.update({
                where: {
                    id: request['params']['communityId'],
                    user_id: request['userId']
                },
                data: {
                    title: request['body']['title'],
                    content: request['body']['content'],
                    media_id: request['body']['mediaId']
                }
            });
        });
        reply.status(204).send();
    }
    catch(err) {
        throw err;
    }
}
