import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { verifyPassword, hashPassword } from "../../lib/bcrypt";
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

export async function updateUserInfoHandler(
  request: FastifyRequest<{
    Body: {
      currentPassword: string;
      name?: string;
      image?: string | null;
      personal_color?: string;
      style?: string;
      height?: number;
      weight?: number;
      gender?: string;
      birth_at?: string | Date;
    };
  }>,
  reply: FastifyReply
) {
  const user = verifyToken(request, reply);
  if (!user) return;
  const userId = user.userId;

  const {
    currentPassword,
    name,
    image,
    personal_color,
    style,
    height,
    weight,
    gender,
    birth_at,
  } = request.body;

  if (!currentPassword) {
    return reply.code(400).send({ message: "현재 비밀번호를 입력해주세요." });
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser)
      return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });

    const isValid = await verifyPassword(currentPassword, dbUser.password);
    if (!isValid)
      return reply
        .code(401)
        .send({ message: "현재 비밀번호가 일치하지 않습니다." });

    const existingUserInfo = await prisma.user_info.findUnique({
      where: { user_id: userId },
    });

    const updatedUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
      },
      select: { id: true, email: true, name: true, image: true },
    });

    let updatedUserInfo = null;
    if (existingUserInfo) {
      updatedUserInfo = await prisma.user_info.update({
        where: { id: existingUserInfo.id },
        data: {
          ...(personal_color !== undefined && { personal_color }),
          ...(style !== undefined && { style }),
          ...(height !== undefined && { height }),
          ...(weight !== undefined && { weight }),
          ...(gender !== undefined && { gender }),
          ...(birth_at !== undefined && {
            birth_at:
              typeof birth_at === "string" ? new Date(birth_at) : birth_at,
          }),
        },
        select: {
          id: true,
          user_id: true,
          personal_color: true,
          style: true,
          height: true,
          weight: true,
          gender: true,
          birth_at: true,
        },
      });
    }

    const updatedUser = await updatedUserPromise;

    reply.send({ user: updatedUser, userInfo: updatedUserInfo });
  } catch (err) {
    reply
      .code(500)
      .send({ message: "정보 수정 도중 오류가 발생했습니다.", error: err });
  }
}

export async function updateUserPasswordHandler(
  request: FastifyRequest<{
    Body: { currentPassword: string; newPassword: string };
  }>,
  reply: FastifyReply
) {
  const user = verifyToken(request, reply);
  if (!user) return;
  const userId = user.userId;

  const { currentPassword, newPassword } = request.body;

  if (!currentPassword || !newPassword) {
    return reply
      .code(400)
      .send({ message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." });
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser)
      return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });

    const isValid = await verifyPassword(currentPassword, dbUser.password);
    if (!isValid)
      return reply
        .code(401)
        .send({ message: "현재 비밀번호가 일치하지 않습니다." });

    const hashedNewPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    reply.send({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (err) {
    reply
      .code(500)
      .send({ message: "비밀번호 변경 중 오류가 발생했습니다.", error: err });
  }
}
