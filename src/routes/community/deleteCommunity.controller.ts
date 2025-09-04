import { FastifyReply } from "fastify";
import { Req } from "../../types";
import {prisma} from "../../lib/prisma";

export default async function deleteCommunity(
  req: Req<{ Params: { communityId: string } }>,
  reply: FastifyReply
) {
  const { communityId } = req.params;
  const me = (req as any).user?.id;
  if (!me) return reply.code(401).send();

  const target = await prisma.communityPost.findUnique({
    where: { id: Number(communityId) },
  });
  if (!target) return reply.code(404).send();
  if (target.userId !== me)
    return reply.code(403).send();

  await prisma.communityPost.delete({
    where: { id: Number(communityId) },
  });

  return reply.send();
}
