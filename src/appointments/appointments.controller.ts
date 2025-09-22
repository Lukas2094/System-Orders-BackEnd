import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
// import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
import { User } from '../users/users.entity';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateAppointmentDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateAppointmentDto) {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.service.remove(id);
    }
}
