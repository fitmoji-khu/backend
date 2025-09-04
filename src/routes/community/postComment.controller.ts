import { FastifyReply } from "fastify";
import { Req } from "../../types";
import {prisma} from "../../lib/prisma";
import { PostCommentBody } from "../../schemas/community";

export default async function postComment(
  req: Req<{ Params: { communityId: string }; Body: PostCommentBody }>,
  reply: FastifyReply
) {
  const { communityId } = req.params;
  const me = (req as any).user?.id;
  if (!me) return reply.code(401).send();

  const { content, mediaIds } = req.body;

  const created = await prisma.communityComment.create({
    data: {
      content,
      userId: me,
      postId: Number(communityId),
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
