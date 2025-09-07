import authHandler from '../../../handlers/auth';
import Module from '../../../lib/module';
import postReactionsController from './postReactions.controller';
import deleteReactionsController from './deleteReactions.controller';
import S from 'fluent-json-schema';
import reactionsSchema from '../../../schemas/reactions'

export default new Module(':communityId/reactions', [
    {
        method: 'POST',
        url: '',
        preHandler: authHandler,
        handler: postReactionsController,
        schema: {
            params: S.object()
                .prop('communityId', reactionsSchema['communityId'].required()),
            body: S.object()
                .prop('emoji', reactionsSchema['emoji'].required())
        }
    },
    {
        method: 'DELETE',
        url: ':reactionId',
        preHandler: authHandler,
        handler: deleteReactionsController,
        schema: {
            params: S.object()
                .prop('communityId', reactionsSchema['communityId'].required())
                .prop('reactionId', reactionsSchema['id'].required())
        }
    },
]);