import Module from '../lib/module';
import usersModule from './users/users.module';

export default new Module('')      
    .addModule(usersModule);  
