import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SendMessageDto,SendImageUrlDto } from './dto/send-message.dto';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Post('send-message')
    async sendMessage(@Body() sendMessageDto: SendMessageDto) {
        return this.whatsappService.sendMessage(sendMessageDto.phoneNumber, sendMessageDto.message);
    }

    @Post('send-image-url')
    async sendImageUrl(@Body() sendImageUrlDto: SendImageUrlDto) {
        return this.whatsappService.sendImageUrl(
            sendImageUrlDto.phoneNumber,
            sendImageUrlDto.imageUrl,
            sendImageUrlDto.caption
        );
    }

    @Get('status')
    async getStatus() {
        return { connected: true, status: 'connected' };
    }

    @Get('messages')
    async getMessages(@Query('phoneNumber') phoneNumber?: string, @Query('limit') limit: number = 20) {
        return this.whatsappService.getMessageHistory(phoneNumber, limit);
    }

    @Post('webhook')
    async handleWebhook(@Body() body: any) {
        // Endpoint para receber webhooks do WhatsApp
        console.log('Webhook recebido:', body);
        return { success: true };
    }
}