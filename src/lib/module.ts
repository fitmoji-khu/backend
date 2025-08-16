import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
type Handler = (request: FastifyRequest, reply: FastifyReply) => any | Promise<any>;
type PreHandler = Handler | Handler[];

export interface RouteOptions<B = unknown, P = unknown, Q = unknown, H = unknown> {
    method: HTTPMethod | HTTPMethod[];
    url: string;
    handler: (req: FastifyRequest<{ Body: B; Params: P; Querystring: Q; Headers: H }>, reply: FastifyReply) => any;
    preHandler?: PreHandler;
    excludePreHandler?: boolean;
    schema?: any;
}

export default class Module {
    private defaultPreHandler?: PreHandler;

    constructor(
        public prefix: string,
        public routers: Array<RouteOptions<any, any, any, any>> = [],
        public modules: Module[] = [],
        opts?: { defaultPreHandler?: PreHandler }
    ) {
        this.defaultPreHandler = opts?.defaultPreHandler;
    }

    private joinUrl(...parts: Array<string | undefined>): string {
        const cleaned = parts
        .filter(Boolean)
        .map(p => (p as string).trim())
        .map(p => p.replace(/(^\/+|\/+$)/g, ''))
        .filter(p => p.length > 0)
        .join('/');
        return '/' + cleaned;
    }

    public Prefix(prefix: string): this {
        this.prefix = this.joinUrl(prefix, this.prefix);
        return this;
    }

    public addRoute<B = unknown, P = unknown, Q = unknown, H = unknown>(route: RouteOptions<B, P, Q, H>): this {
        this.routers.push(route as RouteOptions<any, any, any, any>);
        return this;
    }

    public addRoutes(routes: Array<RouteOptions<any, any, any, any>>): this {
        this.routers.push(...routes);
        return this;
    }

    public addModule(mod: Module): this {
        this.modules.push(mod);
        return this;
    }

    public setDefaultPreHandler(ph: PreHandler): this {
        this.defaultPreHandler = ph;
        return this;
    }

    private toArray<T>(v?: T | T[]): T[] {
        if (!v) return [];
        return Array.isArray(v) ? v : [v];
    }

    public register(instance: FastifyInstance, basePrefix = ''): void {
        const selfPrefix = this.joinUrl(basePrefix, this.prefix); 

        for (const r of this.routers) {
            const url = this.joinUrl(selfPrefix, r.url);        

            const mergedPre: Handler[] = [];
            if (!r.excludePreHandler && this.defaultPreHandler) {
                mergedPre.push(...(this.toArray(this.defaultPreHandler) as Handler[]));
            }
            if (r.preHandler) {
                mergedPre.push(...(this.toArray(r.preHandler) as Handler[]));
            }

            instance.route({
                method: r.method as any,
                url,                                         
                preHandler: mergedPre.length ? mergedPre : undefined,
                handler: r.handler as any,
                schema: r.schema,
            } as any);
        }

        for (const module of this.modules) {
            module.register(instance, selfPrefix);                      
        }
    }
}
