import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from './common';
import { Community } from '../lib/type';
import userSchema from './user';
import mediaSchema from './media';

export default {
    id: commonSchema['id'],
    title: S.string()
        .minLength(1),
    content: S.string(),
    likeCount: S.number()
        .default(0),
    userId: userSchema['id'],
    mediaId: mediaSchema['id'],
}   satisfies Record<keyof Omit<Community, 'createdAt' | 'updatedAt' |'deletedAt'>, JSONSchema>;