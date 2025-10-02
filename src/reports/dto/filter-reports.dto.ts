import { IsString, IsOptional, IsDateString, IsNumberString } from 'class-validator';

export class FiltroRelatorioDto {
    @IsString()
    tipo: 'pedidos' | 'produtos' | 'usuarios';

    @IsOptional()
    @IsDateString()
    dataInicio?: string;

    @IsOptional()
    @IsDateString()
    dataFim?: string;

    // ---- Filtros adicionais ----

    // Pedidos
    @IsOptional()
    @IsString()
    status?: string;

    // Produtos
    @IsOptional()
    @IsNumberString()
    category_id?: string;

    @IsOptional()
    @IsNumberString()
    subcategory_id?: string;

    // Usuários
    @IsOptional()
    @IsNumberString()
    role_id?: string;
}
