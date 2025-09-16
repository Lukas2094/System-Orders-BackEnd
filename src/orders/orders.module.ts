import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        forwardRef(() => WhatsappModule), // Use forwardRef aqui também
        PaymentModule,
    ],
    providers: [OrdersService, WebsocketGateway],
    controllers: [OrdersController],
    exports: [OrdersService], // Exporte o OrdersService
})
export class OrdersModule { }