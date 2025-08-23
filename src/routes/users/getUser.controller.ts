import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

function verifyToken(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    reply.code(401).send({ message: "Authorization 헤더가 없습니다." });
    return null;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    reply.code(401).send({ message: "토큰이 없습니다." });
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as {
      userId: number;
    };
  } catch {
    reply.code(401).send({ message: "유효하지 않은 토큰입니다." });
    return null;
  }
}

export async function getUserInfoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = verifyToken(request, reply);
  if (!user) return;
  const userId = user.userId;

  try {
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        // 필요하면 더 추가 가능
      },
    });

    if (!userInfo) {
      return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    const userExtraInfo = await prisma.user_info.findUnique({
      where: { user_id: userId },
      select: {
        personal_color: true,
        style: true,
        height: true,
        weight: true,
        gender: true,
        birth_at: true,
      },
    });

    reply.send({ user: userInfo, userInfo: userExtraInfo });
  } catch (err) {
    reply.code(500).send({
      message: "사용자 정보 조회 중 오류가 발생했습니다.",
      error: err,
    });
  }
}
