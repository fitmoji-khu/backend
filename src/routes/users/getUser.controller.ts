import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { User } from '../../lib/type';
import { BadRequest } from '../../lib/httpError';
import { presign } from '../../handlers/media';

export default async function (request: FastifyRequest<{
    Params: {
        userId: User['id'];
    };
}>, reply: FastifyReply) {
    let media: { id: number; type: string; url: string } | null = null;

    try {
        const userInfo = await prisma.$transaction(async (transaction) => {
            const _user = await transaction.user.findFirst({
                where: {
                    id: request['params']['userId'],
                    deleted_at: null
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    media: {
                        select: {
                            id: true,
                            key: true,
                            type: true
                        }
                    }
                }
            });

            if (_user === null) {
                throw new BadRequest('Params["userId"] must be valid');
            }

            if (_user.media !== null) {
                const url = await presign(_user['media']['key'], 300);
                media = {
                    id: _user['media']['id'],
                    type: _user['media']['type'],
                    url,
                };
            }

            const _userInfo = await transaction.user_info.findFirst({
                where: {
                    user_id: request['params']['userId']
                },
                select: {
                    personal_color: true,
                    style: true,
                    height: true,
                    weight: true,
                    gender: true,
                    birth_at: true,
                }
            });

            if (_userInfo === null) {
                throw new BadRequest('Params["userId"] must be valid');
            }

            return {
                user: {
                    id: _user['id'],
                    email: _user['email'],
                    name: _user['name'],
                    media
                },
                _userInfo
            };
        });
        reply.status(200)
            .send({
                user: userInfo['user'],
                userInfo: userInfo['_userInfo']
            });
    } catch(err) {
        throw err;
    }
}