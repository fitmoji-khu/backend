import Module from '../lib/module';
import usersModule from './users/users.module';
import authModule from './auth/auth.module';
import mediasModule from './medias/medias.module';
import closetsModule from './closets/closets.module';
import communityModule from './communities/communities.module';
import recommendationsModule from './recommendations/recommendations.module';

export default new Module('')      
    .addModule(usersModule)
    .addModule(authModule)
    .addModule(mediasModule)
    .addModule(closetsModule)
    .addModule(communityModule)
    .addModule(recommendationsModule);