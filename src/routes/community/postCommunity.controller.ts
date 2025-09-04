import { FastifyReply } from "fastify";
import { Req } from "../../types";
import { prisma } from "../../lib/prisma";
import { PostCommunityBody } from "../../schemas/community";

export default async function postCommunity(
  req: Req<{ Body: PostCommunityBody }>,
  reply: FastifyReply
) {
  const me = (req as any).user?.id;
  if (!me) return reply.code(401).send();

  const { title, content, tags, mediaIds } = req.body;

  const created = await prisma.communityPost.create({
    data: {
      title,
      content,
      tags,
      userId: me,
      medias: mediaIds
        ? {
            createMany: {
              data: mediaIds.map((mId) => ({ mediaId: mId })),
            },
          }
        : undefined,
    },
    include: {
      user: { select: { id: true, nickname: true, profileImage: true } },
      medias: { include: { media: true } },
    },
  });

  return reply.send(created);
}
