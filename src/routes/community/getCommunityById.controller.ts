import { FastifyReply } from "fastify";
import { Req } from "../../types";
import {prisma} from "../../lib/prisma";

export default async function getCommunity(req: Req, reply: FastifyReply) {
  const posts = await prisma.communityPost.findMany({
    include: {
      user: { select: { id: true, nickname: true, profileImage: true } },
      medias: { include: { media: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(posts);
}
