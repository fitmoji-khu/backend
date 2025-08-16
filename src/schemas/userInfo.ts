import S, { type JSONSchema } from "fluent-json-schema";
import commonSchema from "./common";
import userSchema from './user'
import { UserInfo } from '../lib/type';

export default {
    id: commonSchema.id,
    user_id: userSchema.id,
    personal_color: S.string(),
    style: S.string(),
    height: S.integer(),
    weight: S.integer(),
    gender: S.string(),
    birth_at: commonSchema.date
}   satisfies Record<keyof UserInfo, JSONSchema>;