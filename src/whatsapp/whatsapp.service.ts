import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);
    private readonly apiUrl = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    private readonly token = process.env.WHATSAPP_TOKEN || 'SEU_TOKEN_DO_WHATSAPP';

    async sendMessage(to: string, message: string) {
        try {
            const payload = {
                messaging_product: 'whatsapp',
                to: to,
                text: { body: message },
            };

            const response = await axios.post(this.apiUrl, payload, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });

            this.logger.log(`Mensagem enviada para ${to}: ${message}`);
            return response.data;
        } catch (error) {
            this.logger.error('Erro ao enviar mensagem', error.response?.data || error.message);
            throw error;
        }
    }
}
