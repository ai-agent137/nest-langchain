import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
    createOrder() {
        return "create new order";
    }
}
