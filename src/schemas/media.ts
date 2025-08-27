import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from "./common";
import { Media } from '../lib/type';

export default {
    id: commonSchema['id'],
    key: S.string(),
    type: S.string()
}   satisfies Record<keyof Omit<Media, 'createdAt' | 'deletedAt'>, JSONSchema>;