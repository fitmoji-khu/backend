import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from './common';
import { Reactions } from '../lib/type';
import userSchema from './user';
import communitySchema from './community';

export default {
    id: commonSchema['id'],
    emoji: S.string(),
    communityId: communitySchema['id'],
    userId: userSchema['id']
}   satisfies Record<keyof Omit<Reactions, 'createdAt' | 'deletedAt'>, JSONSchema>;