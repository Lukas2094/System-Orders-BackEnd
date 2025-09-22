import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Order } from 'src/orders/orders.entity';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.appointments, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Order, (order) => order.appointments, { nullable: true, eager: true })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    scheduled_date: Date;

    @Column({
        type: 'enum',
        enum: ['pendente', 'confirmado', 'cancelado', 'completado'],
        default: 'pendente',
    })
    status: string;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
