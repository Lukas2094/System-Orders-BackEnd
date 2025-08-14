import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Get()
    async findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.ordersService.findById(+id);
    }

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: number, @Body('status') status: string) {
        return this.ordersService.updateStatus(+id, status);
    }
}
