import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { presign } from '../../handlers/media';
import { Community } from '../../lib/type';
import { BadRequest } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        communityId: Community['id']
    }
}>, reply: FastifyReply): Promise<void> {
    try {
        const community = await prisma.$transaction(async (transaction) => {
            const _community = await transaction.community.findFirst({
                where: {
                    id: request['params']['communityId'],
                    deleted_at: null
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
            if (_community === null) {
                throw new BadRequest('Params["communityId"] must be valid');
            }

            const url = _community['media']?.['key'] ? await presign(_community['media']['key'], 300) : null;

            const parentsComments = await transaction.community_comment.findMany({
                where: {
                    community_id: request['params']['communityId'],
                    deleted_at: null,
                    comment_id: null
                },
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    user_id: true,     
                    content: true,    
                    created_at: true 
                }
            })

            const _parentIds = parentsComments.map((comment) => comment['id']);
            const childrenComments = await transaction.community_comment.findMany({
                    where: {
                        community_id: request['params']['communityId'],
                        deleted_at: null,
                        comment_id: { 
                            in: _parentIds 
                        }
                    },
                    orderBy: { 
                        id: 'asc' 
                    },
                    select: {
                        id: true,
                        user_id: true,
                        content: true,
                        created_at: true,
                        comment_id: true
                    }
                })
            
                const parentWithChild = new Map<number, Array<{ id: number; user_id: number; content: string; created_at: Date; comment_id?: number | null; }>>();
                for (const comment of childrenComments) {
                    const pid = comment['comment_id'] as number; 
                    if (parentWithChild.has(pid) === false) {
                        parentWithChild.set(pid, []);
                    }
                    parentWithChild.get(pid)!.push({
                        id: comment['id'],
                        user_id: comment['user_id'],
                        content: comment['content'],
                        created_at: comment['created_at'],
                        comment_id: comment['comment_id']
                    });
                }

                const _comments = parentsComments.map((comment) => ({
                    id: comment['id'],
                    user_id: comment['user_id'],
                    content: comment['content'],
                    created_at: comment['created_at'],
                    replies: parentWithChild.get(comment['id']) ?? []
                }));

            return {
                id: _community['id'],
                title: _community['title'],
                content: _community['content'],
                like_count: _community['like_count'],
                user_id: _community['user_id'],
                media: _community['media'] 
                    ? {
                        id: _community['media']['id'],
                        type: _community['media']['type'],
                        url: url
                    }
                    : null,
                comments: _comments
            };

        });
        reply.status(200)
            .send(community);
    }
    catch(err) {
        throw err;
    }
}
