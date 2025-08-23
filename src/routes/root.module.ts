import Module from '../lib/module';
import usersModule from './users/users.module';
import authModule from './auth/auth.module';

export default new Module('')      
    .addModule(usersModule)
    .addModule(authModule)