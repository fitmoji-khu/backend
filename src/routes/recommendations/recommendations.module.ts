import Module from '../../lib/module';
import S from 'fluent-json-schema';
import recommendationsSchema from '../../schemas/recommendations';
import postRecommendationsController from './postRecommendations.controller';
import authHandler from '../../handlers/auth';

export default new Module('recommendations', [
    {
        method: 'POST',
        url: '',
        preHandler: authHandler,
        handler: postRecommendationsController,
        schema: {
            body: S.object()
                .prop('location', recommendationsSchema['location'].required())
                .prop('closetId', recommendationsSchema['closetId'].required())
        }
    },
]);
