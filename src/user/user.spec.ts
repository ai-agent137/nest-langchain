import { BadRequestException, ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

function setup() {
  const create = vi.fn();
  const prisma = { user: { create } } as unknown as PrismaService;
  const service = new UserService(prisma);
  return { create, controller: new UserController(service) };
}

describe('创建用户', () => {
  it('校验并清理输入后写入数据库，返回创建结果', async () => {
    const { create, controller } = setup();
    const user = { id: 1, email: 'test@example.com', name: '张三' };
    create.mockResolvedValue(user);

    await expect(controller.createUser({
      email: ' test@example.com ', name: ' 张三 ', id: 99,
    })).resolves.toEqual(user);
    expect(create).toHaveBeenCalledWith({
      data: { email: 'test@example.com', name: '张三' },
    });
  });

  it.each([
    undefined,
    { email: 'invalid', name: '张三' },
    { email: 'test@example.com', name: ' ' },
    { email: 'test@example.com' },
  ])('拒绝无效请求体：%j', (body) => {
    const { create, controller } = setup();
    expect(() => controller.createUser(body)).toThrow(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('邮箱唯一约束冲突返回 409', async () => {
    const { create, controller } = setup();
    create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Duplicate email', {
      code: 'P2002', clientVersion: '7.10.1',
    }));
    const error = await controller.createUser({
      email: 'test@example.com', name: '张三',
    }).catch((error: unknown) => error);
    expect(error).toBeInstanceOf(ConflictException);
    expect((error as ConflictException).getStatus()).toBe(409);
  });

  it('保留其他数据库错误', async () => {
    const { create, controller } = setup();
    const error = new Error('Database unavailable');
    create.mockRejectedValue(error);
    await expect(controller.createUser({
      email: 'test@example.com', name: '张三',
    })).rejects.toBe(error);
  });
});
