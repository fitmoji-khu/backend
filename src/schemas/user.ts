import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from "./common";
import { User } from '../lib/type';
import mediaSchema from './media';

export default {
    id: commonSchema['id'],
    email: commonSchema['email'],
    password: S.string(),
    name: S.string(),
    mediaId: mediaSchema['id']
}   satisfies Record<keyof Omit<User, 'createdAt' | 'deletedAt'>, JSONSchema>;