import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), WebsocketModule],
    providers: [OrdersService],
    controllers: [OrdersController],
})
export class OrdersModule { }
