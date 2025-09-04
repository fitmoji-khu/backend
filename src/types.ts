import { FastifyRequest, RouteGenericInterface } from "fastify";

export type Req<T extends RouteGenericInterface = {}> = FastifyRequest<T>;
