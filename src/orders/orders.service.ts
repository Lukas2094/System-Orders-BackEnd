import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private websocketGateway: WebsocketGateway,
    ) { }

    async findAll(): Promise<Order[]> {
        return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<Order> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new Error(`Order with id ${id} not found`);
        }
        return order;
    }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const order = this.ordersRepository.create(createOrderDto);
        const savedOrder = await this.ordersRepository.save(order);

        this.websocketGateway.server.emit('ordersUpdated', savedOrder);

        return savedOrder;
    }

    async updateStatus(id: number, status: string): Promise<Order> {
        const order = await this.findById(id);
        order.status = status;
        const updatedOrder = await this.ordersRepository.save(order);


        this.websocketGateway.server.emit('ordersUpdated', updatedOrder);

        return updatedOrder;
    }
}
