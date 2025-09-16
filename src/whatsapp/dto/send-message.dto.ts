import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SendMessageDto {
    @IsString()
    phoneNumber: string;

    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    messageId?: string;
}

export class SendImageUrlDto {
    @IsString()
    phoneNumber: string;

    @IsString()
    caption: string;

    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsString()
    messageId?: string;
}

export class ProcessOrderDto {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsString()
    customerWhatsapp: string;

    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    messageId?: string;
}