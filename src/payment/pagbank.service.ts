import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PagbankPaymentRequest {
    amount: number;
    orderId: string;
    customer: {
        name: string;
        phone: string;
    };
}

interface PagbankPaymentResponse {
    paymentId: string;
    qrCode: string;
    qrCodeImageUrl?: string; // URL da imagem do QR code
    paymentUrl: string;
    expiresAt: Date;
}

@Injectable()
export class PagbankService {
    private readonly apiUrl: string;
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiUrl = this.configService.get('PAGBANK_API_URL') || 'https://api.pagbank.com.br';
        this.apiKey = this.configService.get('PAGBANK_API_KEY') || '';
    }

    async createPayment(paymentRequest: PagbankPaymentRequest): Promise<PagbankPaymentResponse> {
        try {
       

            const response = await axios.post(`${this.apiUrl}/payments`, {
                amount: paymentRequest.amount * 100,
                currency: 'BRL',
                reference_id: paymentRequest.orderId,
                customer: {
                    name: paymentRequest.customer.name,
                    phones: [
                        {
                            country: '55',
                            area: '11',
                            number: paymentRequest.customer.phone.replace(/\D/g, ''),
                            type: 'MOBILE'
                        }
                    ]
                },
                qr_codes: [
                    {
                        amount: {
                            value: paymentRequest.amount * 100
                        },
                        expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString()
                    }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                paymentId: response.data.id,
                qrCode: response.data.qr_codes[0].text,
                qrCodeImageUrl: response.data.qr_codes[0].links?.[0]?.href, // Ajuste conforme a API real
                paymentUrl: response.data.payment_url,
                expiresAt: new Date(response.data.qr_codes[0].expiration_date)
            };

        } catch (error) {
            console.error('Erro ao criar pagamento PagBank:', error);
            throw new Error('Falha ao processar pagamento');
        }
    }

    async checkPaymentStatus(paymentId: string): Promise<any> {
        try {
            const response = await axios.get(`${this.apiUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            throw error;
        }
    }
}