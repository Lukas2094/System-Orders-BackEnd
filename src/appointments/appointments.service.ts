// appointments.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { User } from '../users/users.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private repo: Repository<Appointment>,
        private readonly wsGateway: WebsocketGateway,
    ) { }

    async create(dto: CreateAppointmentDto, user?: User) {
        if (user?.role?.name === 'user' && dto.user_id !== user.id) {
            throw new ForbiddenException('Você só pode criar seus próprios agendamentos');
        }

        const appointment = this.repo.create({
            ...dto,
            user: { id: dto.user_id } as User,
            order: dto.order_id ? { id: dto.order_id } : undefined,
        });

        const saved = await this.repo.save(appointment);

        // 🔥 Emite evento no WebSocket
        this.wsGateway.emitAppointmentCreated(saved);

        return saved;
    }

    async findAll() {
        return this.repo.find({ relations: ['user', 'order'] });
    }

    async findOne(id: number, user?: User) {
        const appointment = await this.repo.findOne({
            where: { id },
            relations: ['user', 'order'],
        });

        if (!appointment) throw new NotFoundException('Agendamento não encontrado');

        if (user?.role?.name === 'user' && appointment.user.id !== user.id) {
            throw new ForbiddenException('Você não tem acesso a este agendamento');
        }

        return appointment;
    }

    async update(id: number, dto: UpdateAppointmentDto, user?: User) {
        const appointment = await this.findOne(id, user);

        if (user?.role?.name === 'user') {
            throw new ForbiddenException('Clientes não podem editar agendamentos');
        }

        Object.assign(appointment, dto);
        const updated = await this.repo.save(appointment);

        // 🔥 Emite evento no WebSocket
        this.wsGateway.emitAppointmentUpdated(updated);

        return updated;
    }

    async remove(id: number) {
        const appointment = await this.findOne(id);
        await this.repo.remove(appointment);

        this.wsGateway.emitAppointmentDeleted(appointment.id);

        return { deleted: true };
    }
}
