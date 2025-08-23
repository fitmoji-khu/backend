import Module from '../../lib/module';
import S from 'fluent-json-schema';
import userSchema from '../../schemas/user';
import postLoginController from './postLogin.controller';
import postTokenController from './postToken.controller';
import patchPasswordController from './patchPassword.controller';
import authHandler from '../../handlers/auth';

export default new Module('auth', [
    {
        method: 'POST',
        url: 'login',
        excludePreHandler: true,
        handler: postLoginController,
        schema: {
            body: S.object()
                .prop('email', userSchema['email'].required())
                .prop('password', userSchema['password'].required())
        }
    },
    {
        method: 'POST',
        url: 'token',
        excludePreHandler: true,
        handler: postTokenController,
        schema: {
            body: S.object()
                .prop('refreshToken', S.string().required())
        }
    },
    {
        method: 'PATCH',
        url: ':userId/password',
        preHandler: authHandler,
        handler: patchPasswordController,
        schema: {
            params: S.object()
                .prop('userId', userSchema['id'].required()),
            body: S.object()
                .prop('password', userSchema['password'])
                .anyOf([
                    S.object()
                        .required(['password']),
                ])
        }
    }
]);