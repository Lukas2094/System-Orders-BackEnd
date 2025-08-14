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
        origin: '*', // Permitir conexões do frontend
    },
})
export class WebsocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('WebSocket iniciado');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Cliente conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Cliente desconectado: ${client.id}`);
    }

    // Exemplo de evento: atualizar pedidos
    @SubscribeMessage('updateOrders')
    handleUpdateOrders(@MessageBody() data: any) {
        console.log('Update Orders:', data);
        this.server.emit('ordersUpdated', data); // envia para todos os clientes conectados
    }

    // Exemplo de evento: atualizar estoque
    @SubscribeMessage('updateStock')
    handleUpdateStock(@MessageBody() data: any) {
        console.log('Update Stock:', data);
        this.server.emit('stockUpdated', data);
    }
}
