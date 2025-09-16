import { IsString, IsArray, ArrayNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsString()
    customerWhatsapp: string;

    @IsArray()
    @ArrayNotEmpty()
    items: {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
    }[];

    @IsNumber()
    totalAmount: number;

    @IsEnum(['whatsapp', 'pagbank'])
    paymentMethod: 'whatsapp' | 'pagbank';

    @IsString()
    @IsOptional()
    whatsappMessageId?: string;

    @IsString()
    @IsOptional()
    pagbankPaymentId?: string;
}