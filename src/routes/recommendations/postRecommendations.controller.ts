import { FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { Recommendations } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest } from '../../lib/httpError';
import { presign } from '../../handlers/media';

export default async function (request: FastifyRequest<{
    Body: Pick<Recommendations, 'location' | 'closetId'>
}>, reply: FastifyReply): Promise<void> {
    try {
        const userInfo = await prisma.user_info.findFirst({
            where: {
                user_id: request['userId']
            },
            select: {
                personal_color: true,
                style: true,
                gender: true
            }
        })
        if (userInfo === null) {
            throw new BadRequest('Request user must be valid');
        }

        const closet = await prisma.closet.findUnique({
            where: {
                id: request['body']['closetId']
            },
            select: {
                upper_category: true,
                media_id: true,
            }
        })
        if (closet === null) {
            throw new BadRequest('Body["closetId"] must be valid');
        }

        const media = await prisma.media.findUnique({
            where: { 
                id: closet['media_id']
            },
            select: { 
                key: true, 
                type: true 
            },
        });
        if (media === null) {
            throw new BadRequest('Body["mediaId"] must be valid');
        }
        const url = await presign(media['key'], 300);

        // 초단기 기상 예보 연결

        const recommend = await axios.post("http://localhost:8001/recommend", {
            mediaUrl: url,
            category: closet['upper_category'],
            personalColor: userInfo['personal_color'],
            style: userInfo['style'],
            gender: userInfo['gender'],
            location: request['body']['location']
        });

        reply.status(201).send(recommend.data)
    }
    catch(err) {
        throw err;
    }
}
