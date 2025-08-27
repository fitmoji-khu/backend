import { FastifyReply, FastifyRequest } from 'fastify';
import { PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET } from '../../lib/s3';
import { verifyMimeType, buildKey } from '../../handlers/media';
import { BadRequest, ServerError } from '../../lib/httpError';
import { prisma } from '../../lib/prisma';
import { MultipartFile } from '@fastify/multipart';
import { Upload } from '@aws-sdk/lib-storage';

export default async function (request: FastifyRequest, reply: FastifyReply) {
    const multipart = request.parts({ 
        limits: { 
            files: 1, 
            fileSize: 15 * 1024 * 1024 
        } 
    }); 

    let filePart: MultipartFile | null = null;

    for await (const part of multipart) {
        if (part.type === 'file') {
            if (filePart !== null) {
                throw new BadRequest('only one file allowed')
            }
            filePart = part; 
        } 
    }
    if (filePart === null) {
        throw new BadRequest('file must be valid');
    }

    verifyMimeType(filePart.mimetype);
    const key = buildKey(request['userId']);

    try {
        const uploader = new Upload({
            client: s3,
            params: {
                Bucket: BUCKET,
                Key: key,
                Body: filePart.file,       
                ContentType: filePart.mimetype,
            },
        });

        await uploader.done();

        const _media = await prisma.media.create({
            data: { 
                key, 
                type: filePart.mimetype
            },       
            select: { id: true },
        });

        return reply.status(201)
            .send({ id: _media.id });
    } catch (err) {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })).catch(() => {});
        throw err; 
    }
}
