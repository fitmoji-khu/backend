import { S3Client } from '@aws-sdk/client-s3';

export const BUCKET = process.env.STORAGE_BUCKET_NAME!;

export const s3 = new S3Client({
    region: process.env.STORAGE_REGION!,
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY!,
        secretAccessKey: process.env.STORAGE_SECRET_KEY!,
    },
});