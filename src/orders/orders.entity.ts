import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    customerPhone: string;

    @Column('json')
    items: { productId: number; quantity: number; price: number }[];

    @Column({ default: 'pending' }) // pending, paid, shipped
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
