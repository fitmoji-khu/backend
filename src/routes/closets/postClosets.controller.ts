import { FastifyReply, FastifyRequest } from 'fastify';
import { Media } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { BadRequest } from '../../lib/httpError';
import { presign } from '../../handlers/media';
import axios from 'axios';
import { lowerCategory, upperCategory } from '../../lib/category';

export default async function (request: FastifyRequest<{
    Body: Pick<Media, 'id'>
}>, reply: FastifyReply): Promise<void> {
    try {
        const media = await prisma.media.findFirst({
            where: { 
                id: request['body']['id']
            },
            select: { 
                key: true, 
                type: true 
            },
        });

        if (!media) {
            throw new BadRequest('Body["mediaId"] must be valid');
        }

        const url = await presign(media.key, 300);

        const analysis = await axios.post("http://localhost:8001/analysis", {
            mediaUrl: url,
        });

        const _upperCategory = upperCategory(analysis.data.result.category) 
        const _lowerCategory = lowerCategory(analysis.data.result.category) 
        const _color = analysis.data.result.colors.map((c: { hex: string }) => c.hex).join(', ');

        const closet = await prisma.$transaction(async (transaction) => {
            return transaction.closet.create({
                data: {
                    user_id: request['userId'],
                    upper_category: _upperCategory,
                    lower_category: _lowerCategory,
                    accuracy: analysis.data.result.confidence,
                    color: _color,
                    media_id: request['body']['mediaId'],
                },
                select: { 
                    id: true,
                    user_id: true,
                    media_id: true,
                    upper_category: true,
                    lower_category: true,
                    accuracy: true,
                    color: true,
                },
            });
        });

        reply.status(201).send({ 
            id: closet['id'],
            userId: closet['user_id'],
            mediaId: closet['media_id'],
            upperCategory: closet['upper_category'],
            lowerCategory: closet['lower_category'],
            accuracy: closet['accuracy'],
            color: closet['color']
        });
    } catch (err) {
        throw err;
    }
}
