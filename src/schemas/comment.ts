import S, { type JSONSchema } from 'fluent-json-schema';
import commonSchema from './common';
import { CommunityComment } from '../lib/type';
import userSchema from './user';
import communitySchema from './community';

export default {
    id: commonSchema['id'],
    content: S.string(),
    communityId: communitySchema['id'],
    userId: userSchema['id'],
    commentId: S.number()
        .default(null)
}   satisfies Record<keyof Omit<CommunityComment, 'createdAt' | 'deletedAt'>, JSONSchema>;