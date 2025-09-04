import { FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../../lib/prisma";

type Req = FastifyRequest<{ Querystring: { cursor?: number; limit?: number; q?: string; tag?: string } }>;

export default async function getCommunity(req: Req, reply: FastifyReply) {
  const { cursor, limit = 10, q, tag } = req.query;

  const where: any = {};
  if (q) where.AND = [{ OR: [{ title: { contains: q } }, { content: { contains: q } }] }];
  if (tag) where.tags = { contains: tag };

  const items = await prisma.communityPost.findMany({
    where: Object.keys(where).length ? where : undefined,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: "desc" },
    include: { user: { select: { id: true, nickname: true, profileImage: true } }, _count: { select: { comments: true } } },
  });

  const nextCursor = items.length > limit ? items.pop()!.id : null;
  return reply.send({ items, nextCursor });
}
