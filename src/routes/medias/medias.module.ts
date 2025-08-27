import authHandler from '../../handlers/auth';
import Module from '../../lib/module';
import postMediasController from './postMedias.controller';
import S from 'fluent-json-schema';

export default new Module('medias', [
	{
		method: 'POST',
		url: '',
        preHandler: authHandler,
		handler: postMediasController,
		schema: {
			headers: S.object()
				.prop('content-type', S.string().pattern(/^multipart\/form-data;/).required())
		}
	}
]);