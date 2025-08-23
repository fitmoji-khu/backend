import { FastifyReply, FastifyRequest } from "fastify";
import { User, UserInfo } from "../../lib/type";
import { prisma } from "../../lib/prisma";
import { hashPassword, verifyPassword } from "../../lib/bcrypt";
import jwt from "jsonwebtoken";

export async function loginHandler(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { email, password } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      reply
        .code(401)
        .send({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      reply
        .code(401)
        .send({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "FitMoJi2525",
      { expiresIn: "30m" }
    );

    reply.code(200).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    reply.code(500).send({ message: "서버 오류가 발생했습니다.", error });
  }
}
