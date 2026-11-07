import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService:OrderService) {}
    @Get('/create/:id')
    createOrder(@Param("id") id:string) {
        console.log(id);
        return id
    }
}
