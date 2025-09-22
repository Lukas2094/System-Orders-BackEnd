import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateAppointmentDto {
    @IsOptional()
    @IsDateString()
    scheduled_date?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    notes?: string;
}
