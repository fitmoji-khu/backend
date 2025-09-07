import { FastifyReply, FastifyRequest } from 'fastify';
import { CommunityComment } from '../../../lib/type';
import { prisma } from '../../../lib/prisma';
import { BadRequest } from '../../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: CommunityComment['communityId']
    }
    Body: Pick<CommunityComment, 'content' | 'commentId'>;
}>, reply: FastifyReply): Promise<void> {
    try {
        const comment = await prisma.$transaction(async (transaction) => {
            const community = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
                },
            });
            if (community === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            let commentId: number | null = null;

            if (typeof(request['body']['commentId']) === 'number') {
                const _commentId = await transaction.community_comment.findFirst({
                    where: {
                        id: request['body']['commentId'],
                        community_id: request['params']['communityId'],
                        deleted_at: null
                    },
                    select: {
                        comment_id: true
                    }
                });
                if (_commentId === null) {
                    throw new BadRequest('Body["commentId"] must be valid');
                }
                if (_commentId['comment_id'] !== null) {
                    throw new BadRequest('Replies are limited to one level');
                }
                commentId = request['body']['commentId'];
            } 

            const _comment = await transaction.community_comment.create({
                data: {
                    content: request['body']['content'],
                    community_id: request['params']['communityId'],
                    user_id: request['userId'],
                    comment_id: commentId
                },
                select: {
                    id: true
                }
            });
            return _comment;
        })
        reply.status(201)   
            .send(comment);
    }
    catch(err) {
        throw err;
    }
}