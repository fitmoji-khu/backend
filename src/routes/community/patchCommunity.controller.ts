import { FastifyReply } from "fastify";
import { Req } from "../../types";
import {prisma} from "../../lib/prisma";
import { PatchCommunityBody } from "../../schemas/community";

export default async function patchCommunity(
  req: Req<{ Params: { communityId: string }; Body: PatchCommunityBody }>,
  reply: FastifyReply
) {
  const { communityId } = req.params;
  const me = (req as any).user?.id;
  if (!me) return reply.code(401).send({ message: "Unauthorized" });

  const { title, content, tags, mediaIds } = req.body;

  const target = await prisma.communityPost.findUnique({
    where: { id: Number(communityId) },
  });
  if (!target) return reply.code(404).send();
  if (target.userId !== me)
    return reply.code(403).send();

  const updated = await prisma.communityPost.update({
    where: { id: Number(communityId) },
    data: {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(tags ? { tags } : {}),
      ...(mediaIds
        ? {
            medias: {
              deleteMany: {},
              createMany: {
                data: mediaIds.map((mId) => ({ mediaId: mId })),
              },
            },
          }
        : {}),
    },
    include: {
      user: { select: { id: true, nickname: true, profileImage: true } },
      medias: { include: { media: true } },
    },
  });

  return reply.send(updated);
}
