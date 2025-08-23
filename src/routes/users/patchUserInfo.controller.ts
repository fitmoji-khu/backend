import { FastifyRequest, FastifyReply } from "fastify";
import { UserInfo } from '../../lib/type';
import { prisma } from "../../lib/prisma";
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: UserInfo['userId'];
    };
    Body: Partial<Pick<UserInfo, 'personalColor' | 'style' | 'height' | 'weight' | 'gender' | 'birthAt'>>;
}>, reply: FastifyReply) {
    await prisma.$transaction(async (transaction): Promise<void> => {
        const _user = await transaction.user.findFirst({
            where: {
                id: request['params']['userId']
            }
        });

        if (_user === null) {
            throw new BadRequest('Params["userId"] must be valid');
        }

        if (request['params']['userId'] !== request['userId']) {
            throw new Unauthorized('Params["userId"] must be yourself');
        }

        await transaction.user_info.updateMany({
            where: {
                user_id: request['userId']
            },
            data:  { 
                personal_color: request['body']['personalColor'],
                style: request['body']['style'],
                height: request['body']['height'],
                weight: request['body']['weight'],
                gender: request['body']['gender'],
                birth_at: new Date(request['body']['birthAt'] as unknown as string),
            }
        });

        reply.status(204)
            .send();
    });
}