import {ConflictException, Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(data: { email: string; name: string }) {
        try {
            return await this.prisma.user.create({ data });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('邮箱已被使用');
            }
            throw error;
        }
    }

    getUser() {
        return 'Hello User!';
    }
}
