import { Injectable, OnModuleInit, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WhatsAppMessage } from './entities/message.entity';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

// Simulação de cliente WhatsApp (substitua pela biblioteca real que você usar)
interface WhatsAppClient {
    sendMessage: (to: string, message: string) => Promise<any>;
    sendImage: (to: string, imagePath: string, caption: string) => Promise<any>;
    onMessage: (callback: (message: any) => void) => void;
    initialize: () => Promise<void>;
    destroy: () => Promise<void>;
}

interface OrderItem {
    productId: number;
    name: string;
    quantity: number;
    price: number;
}

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
    private isConnected = false;
    private client: WhatsAppClient;

    constructor(
        @InjectRepository(WhatsAppMessage)
        private messageRepository: Repository<WhatsAppMessage>,
        private configService: ConfigService,
        @Inject(forwardRef(() => OrdersService)) // Use forwardRef na injeção
        private ordersService: OrdersService,
    ) { }

    async onModuleInit() {
        await this.initializeWhatsApp();
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.destroy();
        }
    }

    private async initializeWhatsApp(): Promise<void> {
        try {
            console.log('🔄 Inicializando WhatsApp...');

            // Aqui você inicializaria o cliente WhatsApp real
            // Exemplo com whatsapp-web.js:
            /*
            const { Client, LocalAuth } = require('whatsapp-web.js');
            const qrcode = require('qrcode-terminal');
            
            this.client = new Client({
              authStrategy: new LocalAuth({
                clientId: "whatsapp-bot"
              }),
              puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              }
            });
      
            this.client.on('qr', (qr) => {
              console.log('📲 Escaneie o QR Code abaixo:');
              qrcode.generate(qr, { small: true });
            });
      
            this.client.on('ready', () => {
              console.log('✅ WhatsApp conectado!');
              this.isConnected = true;
            });
      
            this.client.on('message', async (message) => {
              await this.handleIncomingMessage(message);
            });
      
            await this.client.initialize();
            */

            // Simulação para desenvolvimento
            this.isConnected = true;
            console.log('✅ WhatsApp simulado conectado!');

        } catch (error) {
            console.error('❌ Erro ao inicializar WhatsApp:', error);
        }
    }

    async sendMessage(phoneNumber: string, message: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('WhatsApp não está conectado');
        }

        const formattedNumber = this.formatPhoneNumber(phoneNumber);

        try {
            // Simulação de envio (substitua pela implementação real)
            console.log(`📤 Enviando mensagem para ${formattedNumber}: ${message}`);

            // Implementação real seria:
            // const result = await this.client.sendMessage(formattedNumber, message);

            const messageId = `wa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Salvar no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId,
                from: 'system',
                to: formattedNumber,
                body: message,
                direction: 'sent',
                type: 'text',
                status: 'processed'
            });

            await this.messageRepository.save(whatsappMessage);

            return { success: true, messageId };

        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);

            // Salvar erro no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId: `error-${Date.now()}`,
                from: 'system',
                to: formattedNumber,
                body: message,
                direction: 'sent',
                type: 'text',
                status: 'error',
                metadata: { error: error.message }
            });

            await this.messageRepository.save(whatsappMessage);

            throw error;
        }
    }

    async sendImage(phoneNumber: string, imageBuffer: Buffer, filename: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('WhatsApp não está conectado');
        }

        const formattedNumber = this.formatPhoneNumber(phoneNumber);

        try {
            // Simulação de envio de imagem (substitua pela implementação real)
            console.log(`📤 Enviando imagem para ${formattedNumber}: ${filename}`);

            // Implementação real seria:
            // const media = new MessageMedia('image/png', imageBuffer.toString('base64'));
            // const result = await this.client.sendMessage(formattedNumber, media, { caption: 'QR Code para pagamento' });

            const messageId = `wa-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Salvar no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId,
                from: 'system',
                to: formattedNumber,
                body: `Imagem: ${filename}`,
                direction: 'sent',
                type: 'image',
                status: 'processed',
                metadata: { filename }
            });

            await this.messageRepository.save(whatsappMessage);

            return { success: true, messageId };

        } catch (error) {
            console.error('❌ Erro ao enviar imagem:', error);

            // Salvar erro no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId: `error-img-${Date.now()}`,
                from: 'system',
                to: formattedNumber,
                body: `Imagem: ${filename}`,
                direction: 'sent',
                type: 'image',
                status: 'error',
                metadata: { error: error.message, filename }
            });

            await this.messageRepository.save(whatsappMessage);

            throw error;
        }
    }

    private async handleIncomingMessage(message: any): Promise<void> {
        try {
            const from = message.from;
            const body = message.body.toLowerCase().trim();

            console.log(`📩 Mensagem recebida de ${from}: ${body}`);

            // Salvar mensagem recebida
            const whatsappMessage = this.messageRepository.create({
                messageId: message.id._serialized,
                from,
                to: 'system',
                body: message.body,
                direction: 'received',
                type: 'text',
                status: 'pending'
            });

            await this.messageRepository.save(whatsappMessage);

            // Processar comando de pedido
            if (body.includes('pedido') || body.includes('comprar') || body.includes('quero')) {
                await this.processOrderRequest(from, message.body, message.id._serialized);
            }

            // Processar outros comandos
            else if (body.includes('status') || body.includes('onde está')) {
                await this.handleStatusRequest(from, body);
            }

            else if (body.includes('ajuda') || body === 'menu') {
                await this.sendHelpMessage(from);
            }

            else {
                await this.sendDefaultResponse(from);
            }

        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
        }
    }

    private async processOrderRequest(from: string, message: string, messageId: string): Promise<void> {
        try {
            // Extrair informações do pedido da mensagem
            // Esta é uma implementação básica - você pode melhorar com NLP
            const customerName = await this.extractCustomerName(from, message);
            const items = await this.extractOrderItems(message);

            if (items.length === 0) {
                await this.sendMessage(from, `❌ Não entendi seu pedido. Por favor, especifique os itens desejados. Exemplo: "Quero 2 pizzas e 1 refrigerante"`);
                return;
            }

            // Calcular total
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Criar DTO do pedido
            const createOrderDto: CreateOrderDto = {
                customerName,
                customerPhone: this.cleanPhoneNumber(from),
                customerWhatsapp: from,
                items: items.map(item => ({
                    productId: item.productId,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount,
                paymentMethod: 'whatsapp', // Default
                whatsappMessageId: messageId
            };

            // Criar pedido
            const order = await this.ordersService.create(createOrderDto);

            // Atualizar mensagem com ID do pedido
            await this.messageRepository.update(
                { messageId },
                { orderId: order.id, status: 'processed' }
            );

            console.log(`✅ Pedido #${order.id} criado via WhatsApp`);

        } catch (error) {
            console.error('❌ Erro ao processar pedido:', error);

            await this.sendMessage(from, `❌ Desculpe, houve um erro ao processar seu pedido. Por favor, tente novamente ou entre em contato conosco.`);

            // Atualizar status da mensagem para erro
            await this.messageRepository.update(
                { messageId },
                { status: 'error', metadata: { error: error.message } }
            );
        }
    }

    private async extractCustomerName(from: string, message: string): Promise<string> {
        // Tentar extrair nome da mensagem
        const nameMatch = message.match(/meu nome é ([a-zA-ZÀ-ÿ\s]+)/i)
            || message.match(/sou ([a-zA-ZÀ-ÿ\s]+)/i)
            || message.match(/chamo ([a-zA-ZÀ-ÿ\s]+)/i);

        if (nameMatch && nameMatch[1]) {
            return nameMatch[1].trim();
        }

        // Se não encontrar, usar número como identificador
        return `Cliente ${from.substring(0, 8)}`;
    }

    private async extractOrderItems(message: string): Promise<OrderItem[]> {
        const items: OrderItem[] = []; // Defina explicitamente o tipo

        // Mapeamento de produtos (substitua pelo seu catálogo real)
        const productCatalog: { [key: string]: OrderItem } = {
            'pizza': { productId: 1, name: 'Pizza', quantity: 1, price: 35.00 },
            'hamburguer': { productId: 2, name: 'Hambúrguer', quantity: 1, price: 25.00 },
            'refrigerante': { productId: 3, name: 'Refrigerante', quantity: 1, price: 8.00 },
            'suco': { productId: 4, name: 'Suco Natural', quantity: 1, price: 10.00 },
            'água': { productId: 5, name: 'Água Mineral', quantity: 1, price: 5.00 },
            'batata': { productId: 6, name: 'Batata Frita', quantity: 1, price: 15.00 },
            'coxinha': { productId: 7, name: 'Coxinha', quantity: 1, price: 6.00 },
            'pastel': { productId: 8, name: 'Pastel', quantity: 1, price: 8.00 },
            'café': { productId: 9, name: 'Café', quantity: 1, price: 4.00 },
            'bolo': { productId: 10, name: 'Bolo', quantity: 1, price: 12.00 },
        };

        // Procurar por padrões de quantidade e produto
        const quantityRegex = /(\d+)\s*(x|\*)?\s*([a-zA-ZÀ-ÿ]+)/gi;
        let match;

        while ((match = quantityRegex.exec(message)) !== null) {
            const quantity = parseInt(match[1]);
            const productName = match[3].toLowerCase();

            // Encontrar produto correspondente
            const productKey = Object.keys(productCatalog).find(key =>
                productName.includes(key)
            );

            if (productKey) {
                const product = { ...productCatalog[productKey] }; // Copia o produto
                product.quantity = quantity; // Atualiza a quantidade
                items.push(product);
            }
        }

        // Se não encontrou padrão de quantidade, procurar por produtos simples
        if (items.length === 0) {
            Object.keys(productCatalog).forEach(key => {
                if (message.toLowerCase().includes(key)) {
                    const product = { ...productCatalog[key] }; // Copia o produto
                    items.push(product);
                }
            });
        }

        return items;
    }

    private async handleStatusRequest(from: string, message: string): Promise<void> {
        // Extrair número do pedido se mencionado
        const orderMatch = message.match(/#(\d+)/) || message.match(/pedido\s+(\d+)/i);

        if (orderMatch) {
            const orderId = parseInt(orderMatch[1]);

            try {
                const order = await this.ordersService.findById(orderId);
                await this.sendMessage(from, `📦 Status do Pedido #${orderId}: ${this.getStatusText(order.status)}`);
            } catch (error) {
                await this.sendMessage(from, `❌ Pedido #${orderId} não encontrado.`);
            }
        } else {
            await this.sendMessage(from, `Por favor, informe o número do pedido. Exemplo: "Status do pedido #123"`);
        }
    }

    private async sendHelpMessage(from: string): Promise<void> {
        const helpMessage = `🆘 *MENU DE AJUDA* 🆘

📦 *FAZER PEDIDO*
Ex: "Quero 2 pizzas e 1 refrigerante"
Ex: "Fazer pedido: 1 hambúrguer, 2 sucos"

📋 *VER STATUS*
Ex: "Status do pedido #123"
Ex: "Onde está meu pedido #123"

💳 *PAGAMENTO*
Ex: "Quero pagar com PIX"
Ex: "Pagamento no cartão"

📞 *ATENDIMENTO*
Ex: "Falar com atendente"

Digite "menu" a qualquer momento para ver estas opções!`;

        await this.sendMessage(from, helpMessage);
    }

    private async sendDefaultResponse(from: string): Promise<void> {
        const response = `Olá! 😊

Como posso ajudar você hoje?

• Digite "pedido" para fazer um novo pedido
• Digite "status" para verificar um pedido
• Digite "ajuda" para ver todas as opções

Ou descreva o que você precisa!`;

        await this.sendMessage(from, response);
    }

    private getStatusText(status: string): string {
        const statusMap = {
            'pending': '⌛ Aguardando confirmação',
            'confirmed': '✅ Confirmado - Em preparação',
            'paid': '💳 Pago - Pronto para entrega',
            'delivered': '🚚 Entregue',
            'cancelled': '❌ Cancelado'
        };
        return statusMap[status] || status;
    }

    private formatPhoneNumber(phone: string): string {
        // Remove caracteres não numéricos e adiciona código do país
        const cleaned = phone.replace(/\D/g, '');
        return `55${cleaned}@c.us`;
    }

    private cleanPhoneNumber(phone: string): string {
        // Remove o @c.us e formata para número brasileiro
        return phone.replace('@c.us', '').replace('55', '');
    }

    async sendImageUrl(phoneNumber: string, imageUrl: string, caption: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('WhatsApp não está conectado');
        }

        const formattedNumber = this.formatPhoneNumber(phoneNumber);

        try {
            // Simulação de envio de imagem por URL
            console.log(`📤 Enviando imagem URL para ${formattedNumber}: ${imageUrl}`);

            // Implementação real seria:
            // const media = await MessageMedia.fromUrl(imageUrl);
            // const result = await this.client.sendMessage(formattedNumber, media, { caption });

            const messageId = `wa-img-url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Salvar no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId,
                from: 'system',
                to: formattedNumber,
                body: `Imagem URL: ${caption}`,
                direction: 'sent',
                type: 'image',
                status: 'processed',
                metadata: { imageUrl, caption }
            });

            await this.messageRepository.save(whatsappMessage);

            return { success: true, messageId };

        } catch (error) {
            console.error('❌ Erro ao enviar imagem por URL:', error);

            // Salvar erro no histórico
            const whatsappMessage = this.messageRepository.create({
                messageId: `error-img-url-${Date.now()}`,
                from: 'system',
                to: formattedNumber,
                body: `Imagem URL: ${caption}`,
                direction: 'sent',
                type: 'image',
                status: 'error',
                metadata: { error: error.message, imageUrl, caption }
            });

            await this.messageRepository.save(whatsappMessage);

            throw error;
        }
    }

    async getMessageHistory(phoneNumber?: string, limit: number = 20): Promise<WhatsAppMessage[]> {
        const where = phoneNumber ? { to: phoneNumber } : {};
        return this.messageRepository.find({
            where,
            order: { timestamp: 'DESC' },
            take: limit
        });
    }
}