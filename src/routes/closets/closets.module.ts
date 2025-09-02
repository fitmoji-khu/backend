import authHandler from '../../handlers/auth';
import Module from '../../lib/module';
import S from 'fluent-json-schema';
import postClosetsController from './postClosets.controller';
import getClosetsController from './getClosets.controller';
import patchClosetController from './patchCloset.controller';
import deleteClosetController from './deleteCloset.controller';
import closetSchema from '../../schemas/closet';

export default new Module('closets', [
    {
        method: 'POST',
        url: '',
        preHandler: authHandler,
        handler: postClosetsController,
        schema: {
            body: S.object()
                .prop('label', closetSchema['label'].required())
                .prop('accuracy', closetSchema['accuracy'].required())
                .prop('color', closetSchema['color'].required())
                .prop('mediaId', closetSchema['mediaId'].required())
        }
    },
    {
        method: 'GET',
        url: ':userId',
        preHandler: authHandler,
        handler: getClosetsController,
    }, 
    {
        method: 'PATCH',
        url: ':closetId',
        preHandler: authHandler,
        handler: patchClosetController,
        schema: {
            params: S.object()
                .prop('closetId', closetSchema['id'].required()),
            body: S.object()
                .prop('label', closetSchema['label'].required())
                .prop('color', closetSchema['color'].required())
                .prop('mediaId', closetSchema['mediaId'].required())
                .anyOf([
                    S.object()
                        .required(['label']),
                    S.object()
                        .required(['color'])
                    S.object()
                        .required(['mediaId']) 
                ])
        }
    },  
    {
        method: 'DELETE',
        url: ':closetId',
        preHandler: authHandler,
        handler: deleteClosetController,
        schema: {
            params: S.object()
                .prop('closetId', closetSchema['id'].required())
        }
    },   
]);