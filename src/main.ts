import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerConfig, swaggerUiConfig } from './config/swagger';
import routes from './routes/root.module'
import multipart from '@fastify/multipart';

const fastify = Fastify({
    logger: true,
    // https: {
    //     key: fs.readFileSync('./server.key'),
    //     cert: fs.readFileSync('./server.crt')
    // }
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie);

fastify.register(cors, {
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    credentials: true, 
    allowedHeaders: ['Content-Type', 'authorization']
});

fastify.register(multipart);

fastify.register(fastifySwagger, swaggerConfig);
fastify.register(fastifySwaggerUi, swaggerUiConfig);
routes.register(fastify);

const start = async () => {
    try {
        await fastify.listen({port: 8083, host: '0.0.0.0'})
        console.log("Server Start!")
    }
    catch(error) {
        fastify.log.error(error)
        process.exit(1)
    }
};
start()