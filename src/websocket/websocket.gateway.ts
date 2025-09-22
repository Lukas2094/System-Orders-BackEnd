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
        // console.log('📦 Update Orders:', data);
        this.server.emit('ordersUpdated', data);
    }

    // ---- Eventos de estoque ----
    @SubscribeMessage('updateStock')
    handleUpdateStock(@MessageBody() data: any) {
        // console.log('📦 Update Stock:', data);
        this.server.emit('stockUpdated', data);
    }

    // ---- Eventos de usuários ----
    emitUserUpdated(user: any) {
        this.server.emit('userUpdated', {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role, // objeto { id, name }
        });
    }

    emitUserDeleted(userId: number) {
        // console.log('🗑️ User deleted:', userId);
        this.server.emit('userDeleted', userId);
    }

    // ---- Eventos de menus ----
    emitMenuCreated(menu: any) {
        // console.log('🆕 Menu criado:', menu);
        this.server.emit('menuCreated', menu);
    }

    emitMenuUpdated(menu: any) {
        // console.log('✏️ Menu atualizado:', menu);
        this.server.emit('menuUpdated', menu);
    }

    emitMenuDeleted(menuId: number) {
        // console.log('🗑️ Menu deletado:', menuId);
        this.server.emit('menuDeleted', menuId);
    }

    emitSubmenuCreated(submenu) {
        // console.log('🆕 Submenu criado:', submenu);
        this.server.emit('submenuCreated', submenu);
    }

    emitSubmenuDeleted(id) {
        // console.log('🗑️ Submenu deletado:', id);
        this.server.emit('submenuDeleted', id);
    }

    emitSubmenuUpdated(submenu) {
        // console.log('✏️ Submenu atualizado:', submenu);
        this.server.emit('submenuUpdated', submenu);
    }

    // ---- Eventos de agendamentos ----
    emitAppointmentCreated(appointment: any) {
        // console.log('🆕 Agendamento criado:', appointment);
        this.server.emit('appointmentCreated', appointment);
    }

    emitAppointmentUpdated(appointment: any) {
        // console.log('✏️ Agendamento atualizado:', appointment);
        this.server.emit('appointmentUpdated', appointment);
    }

    emitAppointmentDeleted(id: number) {
        // console.log('🗑️ Agendamento deletado:', id);
        this.server.emit('appointmentDeleted', id);
    }
}
