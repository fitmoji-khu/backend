import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";

export async function protectedHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    reply.code(401).send({ message: "토큰이 없습니다." });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "FitMoJi2525");
    reply.send({ message: "토큰 검증 성공", user: decoded });
  } catch {
    reply.code(401).send({ message: "유효하지 않은 토큰입니다." });
  }
}
