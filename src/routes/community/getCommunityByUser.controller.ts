import { FastifyReply } from "fastify";
import { Req } from "../../types";
import {prisma} from "../../lib/prisma";

export default async function getCommunityByUser(
  req: Req<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = req.params;

  const posts = await prisma.communityPost.findMany({
    where: { userId: Number(userId) },
    include: {
      user: { select: { id: true, nickname: true, profileImage: true } },
      medias: { include: { media: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(posts);
}
