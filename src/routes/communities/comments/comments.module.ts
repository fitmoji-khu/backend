import authHandler from '../../../handlers/auth';
import Module from '../../../lib/module';
import postCommentsController from './postComments.controller';
import S from 'fluent-json-schema';
import commentSchema from '../../../schemas/comment';

export default new Module(':communityId/comments', [
    {
        method: 'POST',
        url: '',
        preHandler: authHandler,
        handler: postCommentsController,
        schema: {
            params: S.object()
                .prop('communityId', commentSchema['communityId'].required()),
            body: S.object()
                .prop('content', commentSchema['content'].required())
                .prop('commentId', commentSchema['commentId'].required())
        }
    },
]);