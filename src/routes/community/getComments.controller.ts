import { FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../../lib/prisma";

type Req = FastifyRequest<{ Params: { communityId: number }; Querystring: { cursor?: number; limit?: number } }>;

export default async function getComments(req: Req, reply: FastifyReply) {
  const { communityId } = req.params;
  const { cursor, limit = 10 } = req.query;

  const items = await prisma.communityComment.findMany({
    where: { postId: Number(communityId) },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: "asc" },
    include: { user: { select: { id: true, nickname: true, profileImage: true } } },
  });

  const nextCursor = items.length > limit ? items.pop()!.id : null;
  return reply.send({ items, nextCursor });
}
