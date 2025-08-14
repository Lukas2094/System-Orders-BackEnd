import { IsString, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsArray()
    @ArrayNotEmpty()
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];
}
