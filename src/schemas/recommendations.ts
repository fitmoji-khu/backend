import S, { type JSONSchema } from 'fluent-json-schema';
import { Recommendations } from '../lib/type';
import closetSchema from './closet';

export default {
    location: S.string(),
    closetId: closetSchema['id']
}   satisfies Record<keyof Recommendations, JSONSchema>;