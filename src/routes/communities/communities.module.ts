import authHandler from '../../handlers/auth';
import Module from '../../lib/module';
import S from 'fluent-json-schema';
import postCommunitiesController from './postCommunities.controller';
import getCommunitiesController from './getCommunities.controller';
import getCommunityController from './getCommunity.controller';
import getCommunityByUserIdController from './getCommunityByUserId.controller';
import patchCommunityController from './patchCommunity.controller';
import deleteCommunityController from './deleteCommunity.controller';
import communitySchema from '../../schemas/community';
import commentsModule from './comments/comments.module';
import reactionsModule from './reactions/reactions.module';

export default new Module('communities', [
    {
        method: 'POST',
        url: '',
        preHandler: authHandler,
        handler: postCommunitiesController,
        schema: {
            body: S.object()
                .prop('title', communitySchema['title'].required())
                .prop('content', communitySchema['content'].required())
                .prop('mediaId', communitySchema['mediaId'])
        }
    },
    {
        method: 'GET',
        url: '',
        preHandler: authHandler,
        handler: getCommunitiesController,
    }, 
    {
        method: 'GET',
        url: ':communityId',
        preHandler: authHandler,
        handler: getCommunityController,
        schema: {
            params: S.object()
                .prop('communityId', communitySchema['id'].required())
        }
    }, 
    {
        method: 'GET',
        url: 'users/:userId',
        preHandler: authHandler,
        handler: getCommunityByUserIdController,
        schema: {
            params: S.object()
                .prop('userId', communitySchema['userId'].required())
        }
    }, 
    {
        method: 'PATCH',
        url: ':communityId',
        preHandler: authHandler,
        handler: patchCommunityController,
        schema: {
            params: S.object()
                .prop('communityId', communitySchema['id'].required()),
            body: S.object()
                .prop('title', communitySchema['title'])
                .prop('content', communitySchema['content'])
                .prop('mediaId', communitySchema['mediaId'])
                .anyOf([
                    S.object()
                        .required(['title']),
                    S.object()
                        .required(['content']),
                    S.object()
                        .required(['mediaId'])
                ])
        }
    }, 
    {
        method: 'DELETE',
        url: ':communityId',
        preHandler: authHandler,
        handler: deleteCommunityController,
        schema: {
            params: S.object()
                .prop('communityId', communitySchema['id'].required())
        }
    }
], [commentsModule, reactionsModule]);