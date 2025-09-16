import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PagbankService } from '../payment/pagbank.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private websocketGateway: WebsocketGateway,
        @Inject(forwardRef(() => WhatsappService))
        private readonly whatsappService: WhatsappService,
        private readonly pagbankService: PagbankService,
    ) { }

    async findAll(): Promise<Order[]> {
        return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<Order> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const order = this.ordersRepository.create(createOrderDto);
        const savedOrder = await this.ordersRepository.save(order);

        // Notificar via WebSocket
        this.websocketGateway.server.emit('ordersUpdated', savedOrder);

        // Enviar confirmação via WhatsApp
        await this.sendOrderConfirmation(savedOrder);

        // Processar pagamento se for PagBank
        if (createOrderDto.paymentMethod === 'pagbank') {
            await this.processPagbankPayment(savedOrder);
        }

        return savedOrder;
    }

    async updateStatus(id: number, status: string): Promise<Order> {
        const order = await this.findById(id);
        order.status = status;
        const updatedOrder = await this.ordersRepository.save(order);

        // Notificar via WebSocket
        this.websocketGateway.server.emit('ordersUpdated', updatedOrder);

        // Enviar atualização de status via WhatsApp
        await this.sendStatusUpdate(updatedOrder);

        return updatedOrder;
    }

    private async sendOrderConfirmation(order: Order): Promise<void> {
        const message = `✅ *PEDIDO CONFIRMADO* ✅
        
📦 *Pedido:* #${order.id}
👤 *Cliente:* ${order.customerName}
📞 *Telefone:* ${order.customerPhone}
💰 *Total:* R$ ${order.totalAmount.toFixed(2)}
📋 *Itens:* 
${order.items.map(item => `   - ${item.quantity}x ${item.productName} - R$ ${item.price.toFixed(2)}`).join('\n')}

⏳ *Status:* ${this.getStatusText(order.status)}

Obrigado pelo pedido!`;

        await this.whatsappService.sendMessage(order.customerWhatsapp, message);
    }

    private async sendStatusUpdate(order: Order): Promise<void> {
        const message = `📦 *ATUALIZAÇÃO DE PEDIDO* 📦
        
Pedido #${order.id}
Status: ${this.getStatusText(order.status)}

Acompanhe seu pedido em tempo real!`;

        await this.whatsappService.sendMessage(order.customerWhatsapp, message);
    }

    private async processPagbankPayment(order: Order): Promise<void> {
        try {
            const paymentData = await this.pagbankService.createPayment({
                amount: order.totalAmount,
                orderId: order.id.toString(),
                customer: {
                    name: order.customerName,
                    phone: order.customerPhone
                }
            });

            // Atualizar ordem com dados do pagamento
            order.pagbankPaymentId = paymentData.paymentId;
            order.pagbankQrCode = paymentData.qrCode;
            order.pagbankPaymentUrl = paymentData.paymentUrl;

            await this.ordersRepository.save(order);

            // Enviar instruções de pagamento via WhatsApp
            const paymentMessage = `💳 *PAGAMENTO PAGBANK* 💳
        
Para finalizar seu pedido, efetue o pagamento de R$ ${order.totalAmount.toFixed(2)}

📲 *Opções de Pagamento:*
1. PIX: Use o código PIX abaixo
2. Cartão: Acesse o link: ${paymentData.paymentUrl}

🔢 *Código PIX:*
${paymentData.qrCode}

⏰ *Validade:* 30 minutos

Após o pagamento, seu pedido será processado automaticamente!`;

            await this.whatsappService.sendMessage(order.customerWhatsapp, paymentMessage);

            // Se tiver URL de imagem do QR code, enviar como imagem
            if (paymentData.qrCodeImageUrl) {
                await this.whatsappService.sendImageUrl(
                    order.customerWhatsapp,
                    paymentData.qrCodeImageUrl,
                    'QR Code para pagamento PIX'
                );
            }

        } catch (error) {
            console.error('Erro no processamento do pagamento:', error);

            // Notificar erro via WhatsApp
            const errorMessage = `❌ *ERRO NO PAGAMENTO* ❌
        
Houve um erro ao processar seu pagamento. Por favor, tente novamente ou entre em contato conosco.`;

            await this.whatsappService.sendMessage(order.customerWhatsapp, errorMessage);
        }
    }

    private getStatusText(status: string): string {
        const statusMap = {
            'pending': '⌛ Aguardando confirmação',
            'confirmed': '✅ Confirmado',
            'paid': '💳 Pago',
            'delivered': '🚚 Entregue',
            'cancelled': '❌ Cancelado'
        };
        return statusMap[status] || status;
    }
}