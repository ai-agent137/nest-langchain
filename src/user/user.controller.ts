import {BadRequestException, Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {z} from 'zod';

const createUserSchema = z.object({
    email: z.string().trim().pipe(z.email()),
    name: z.string().trim().min(1),
});

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() body: unknown) {
        const result = createUserSchema.safeParse(body);
        if (!result.success) {
            throw new BadRequestException('请提供有效的 email 和非空 name');
        }
        return this.userService.createUser(result.data);
    }

    @Get("/get")
    getUser() {
        return this.userService.getUser();
    }
}
