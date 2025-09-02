import { FastifyRequest, FastifyReply } from "fastify";
import { User } from '../../lib/type';
import { prisma } from "../../lib/prisma";
import { BadRequest, Unauthorized } from '../../lib/httpError';

export default async function (request: FastifyRequest<{
    Params: {
        userId: User['id'];
    };
    Body: Partial<Pick<User, 'name' | 'mediaId' >>;
}>, reply: FastifyReply): Promise<void> {
    try {
        await prisma.$transaction(async (transaction): Promise<void> => {
            const _user = await transaction.user.findUnique({
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
            
            if (request['body']['name'] === undefined && request['body']['mediaId'] === undefined) {
                throw new BadRequest('Body must include at least one updatable field');
            }

            await transaction.user.update({
                where: {
                    id: request['params']['userId']
                },
                data:  { 
                    name: request['body']['name'],
                    media_id: request['body']['mediaId']
                }
            });
        });
        reply.status(204).send();
    } catch(err) {
        throw err;
    }
}