import { IsNumber } from 'class-validator';

export class UpdateStockDto {
    @IsNumber()
    quantity: number; // valor positivo = entrada, negativo = saída
}
