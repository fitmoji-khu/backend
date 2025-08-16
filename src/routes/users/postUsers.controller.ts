import { FastifyReply, FastifyRequest } from 'fastify';
import { User, UserInfo } from '../../lib/type';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/bcrypt';

export default async function (request: FastifyRequest<{
    Body: {
        email: User["email"],
        password: User['password'],
        name: User['name'],
        image: User['image'] | undefined,
        personal_color: UserInfo['personal_color'],
        style: UserInfo['style'],
        height: UserInfo['height'],
        weight: UserInfo['weight'],
        gender: UserInfo['gender'],
        birth_at: UserInfo['birth_at'] | string
    }
}>, reply: FastifyReply): Promise<void> {
    const { email, password, name, image, personal_color, style, height, weight, gender, birth_at } = request.body;

    try {
        const postUser = await prisma.$transaction(async (transaction) => {
        const hashed = await hashPassword(password);

        const user = await transaction.user.create({
            data: {
                email: email,
                password: hashed,
                name: name,
                image: image ?? null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
            },
        });

        const userInfo = await transaction.user_info.create({
            data: {
                user_id: user.id,
                personal_color: personal_color,
                style: style,
                height: height,
                weight: weight,
                gender: gender,
                birth_at: typeof birth_at === 'string' ? new Date(birth_at) : birth_at,
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

        return { user, userInfo };
    });

    reply.code(201).send(postUser);
    } catch (err: any) {
        if (err?.code === 'P2002') {
            const fields = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'unique';
            reply.code(409).send({ message: `${fields} already in use` });
            return;
        }
    throw err;
    }
}
