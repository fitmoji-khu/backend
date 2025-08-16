import Module, { RouteOptions } from '../../lib/module';
import S from 'fluent-json-schema';
import postUsersController from './postUsers.controller';
import userSchema from '../../schemas/user';
import userInfoSchema from '../../schemas/userInfo';

export default new Module('users', [{
    method: 'POST',
    url: '',
    excludePreHandler: true,
    handler: postUsersController,
    schema: {
        body: S.object()
            .prop('email', userSchema.email.required())
            .prop('password', userSchema.password.required())
            .prop('name', userSchema.name.required())
            .prop('image', userSchema.image)             
            .prop('personal_color', userInfoSchema.personal_color.required())
            .prop('style', userInfoSchema.style.required())
            .prop('height', userInfoSchema.height.required())
            .prop('weight', userInfoSchema.weight.required())
            .prop('gender', userInfoSchema.gender.required())
            .prop('birth_at', userInfoSchema.birth_at.required())
    }
}]);