import S, { type JSONSchema } from 'fluent-json-schema';
import { Closet } from '../lib/type';
import commonSchema from "./common";
import userSchema from './user';
import mediaSchema from './media';

export default {
    id: commonSchema['id'],
    userId: userSchema['id'],
    label: S.string(),
    accuracy: S.number(),
    color: S.string()
        .maxLength(20),
    mediaId: mediaSchema['id']
}   satisfies Record<keyof Omit<Closet, 'createdAt' | 'deletedAt'>, JSONSchema>;