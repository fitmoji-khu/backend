import Module from '../../lib/module';
import S from 'fluent-json-schema';
import userSchema from '../../schemas/user';
import userInfoSchema from '../../schemas/userInfo';
import postUsersController from './postUsers.controller';
import getUserController from './getUser.controller';
import patchUserInfoController from './patchUserInfo.controller';
import patchUserController from './patchUser.controller';
import authHandler from '../../handlers/auth';

export default new Module('users', [
    {
        method: 'POST',
        url: '',
        excludePreHandler: true,
        handler: postUsersController,
        schema: {
            body: S.object()
                .prop('email', userSchema['email'].required())
                .prop('password', userSchema['password'].required())
                .prop('name', userSchema['name'].required())
                .prop('personalColor', userInfoSchema['personalColor'].required())
                .prop('style', userInfoSchema['style'].required())
                .prop('height', userInfoSchema['height'].required())
                .prop('weight', userInfoSchema['weight'].required())
                .prop('gender', userInfoSchema['gender'].required())
                .prop('birthAt', userInfoSchema['birthAt'].required())
        }
    },
    {
        method: 'GET',  
        url: ':userId',
        preHandler: authHandler,  
        handler: getUserController,
        schema: {
            params: S.object()
                .prop('userId', userSchema['id'])
        }
    },
    {
        method: 'PATCH',
        url: ':userId/info',
        preHandler: authHandler,
        handler: patchUserInfoController,
        schema: {
            params: S.object()
                .prop('userId', userInfoSchema['userId'].required()),
            body: S.object()        
                .prop('personalColor', userInfoSchema['personalColor'])
                .prop('style', userInfoSchema['style'])
                .prop('height', userInfoSchema['height'])
                .prop('weight', userInfoSchema['weight'])
                .prop('gender', userInfoSchema['gender'])
                .prop('birthAt', userInfoSchema['birthAt'])
                .anyOf([
                    S.object()
                        .required(['personalColor']),
                    S.object()
                        .required(['style']),
                    S.object()
                        .required(['height']),
                    S.object()
                        .required(['weight']),
                    S.object()
                        .required(['gender']),
                    S.object()
                        .required(['birthAt']),  
                ])
        }
    },
    {
        method: 'PATCH',
        url: ':userId',
        preHandler: authHandler,
        handler: patchUserController,
        schema: {
            params: S.object()
                .prop('userId', userSchema['id'].required()),
            body: S.object()
                .prop('name', userSchema['name'])
                .prop('mediaId', userSchema['mediaId'])
                .anyOf([
                    S.object()
                        .required(['name']),
                    S.object()
                        .required(['mediaId'])
                ])
        }
    }
]);