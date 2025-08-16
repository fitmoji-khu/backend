import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { join } from 'path/posix';

type HTTPMethod = | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

type Handler = (request: FastifyRequest, reply: FastifyReply) => any | Promise<any>;
type PreHandler = Handler | Handler[];

export interface RouteOptions {
    method: HTTPMethod | HTTPMethod[];
    url: string;              
    schema?: any;              
    preHandler?: PreHandler;   
    excludePreHandler?: boolean; 
    handler: Handler;
}

export default class Module {
    private defaultPreHandler?: PreHandler;
    addRoutes: any;

    constructor(
        public prefix: string,
        public routers: RouteOptions[] = [],
        public modules: Module[] = [],
        opts?: { defaultPreHandler?: PreHandler } 
    ) {
        this.defaultPreHandler = opts?.defaultPreHandler;
    }

    public Prefix(prefix: string): this {
        this.prefix = join(prefix, this.prefix);
        return this;
    }

    private toArray<T>(v?: T | T[]): T[] {
        if (!v) return [];
        return Array.isArray(v) ? v : [v];
        }

    public register(instance: FastifyInstance, basePrefix = ''): void {
        const prefix = join(basePrefix, this.prefix);

        for (const _ of this.routers) {
        const url = join(prefix, _.url);

        const mergedPre: Handler[] = [];
        if (!_.excludePreHandler && this.defaultPreHandler) {
            mergedPre.push(...(this.toArray(this.defaultPreHandler) as Handler[]));
        }
        if (_.preHandler) {
            mergedPre.push(...(this.toArray(_.preHandler) as Handler[]));
        }

        instance.route({
            method: _.method as any,
            url,
            schema: _.schema,
            preHandler: mergedPre.length ? mergedPre : undefined,
            handler: _.handler,
        } as any);
        }

        for (const module of this.modules) {
            module.register(instance, prefix);
        }
    }
}
