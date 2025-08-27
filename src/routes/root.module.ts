import Module from '../lib/module';
import usersModule from './users/users.module';
import authModule from './auth/auth.module';
import mediasModule from './medias/medias.module';

export default new Module('')      
    .addModule(usersModule)
    .addModule(authModule)
    .addModule(mediasModule)