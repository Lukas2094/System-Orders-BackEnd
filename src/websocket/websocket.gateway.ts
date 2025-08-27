import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // permitir conexões do frontend
    },
})
export class WebsocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('✅ WebSocket iniciado');
    }

    handleConnection(client: Socket) {
        console.log(`🔌 Cliente conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Cliente desconectado: ${client.id}`);
    }

    // ---- Eventos de pedidos ----
    @SubscribeMessage('updateOrders')
    handleUpdateOrders(@MessageBody() data: any) {
        console.log('📦 Update Orders:', data);
        this.server.emit('ordersUpdated', data);
    }

    // ---- Eventos de estoque ----
    @SubscribeMessage('updateStock')
    handleUpdateStock(@MessageBody() data: any) {
        console.log('📦 Update Stock:', data);
        this.server.emit('stockUpdated', data);
    }

    // ---- Eventos de usuários ----
    emitUserUpdated(user: any) {
        // console.log('👤 User updated:', user);
        this.server.emit('userUpdated', user);
    }

    emitUserDeleted(userId: number) {
        console.log('🗑️ User deleted:', userId);
        this.server.emit('userDeleted', userId);
    }
}
