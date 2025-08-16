import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from "./common";
import userSchema from './user';
import { User } from '../lib/type';

export default {
    id: commonSchema.id,
    email: userSchema.email,
    password: S.string(),
    name: S.string(),
    image: S.string()
        .maxLength(500)
}   satisfies Record<keyof Omit<User, 'created_at' | 'deleted_at'>, JSONSchema>;