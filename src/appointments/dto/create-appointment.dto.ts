import { IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
    @IsInt()
    user_id: number;

    @IsOptional()
    @IsInt()
    order_id?: number;

    @IsNotEmpty()
    @IsDateString()
    scheduled_date: string;

    @IsOptional()
    notes?: string;
}
