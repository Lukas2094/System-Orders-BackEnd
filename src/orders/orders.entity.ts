import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    customerPhone: string;

    @Column()
    customerWhatsapp: string;

    @Column('json')
    items: { productId: number; productName: string; quantity: number; price: number }[];

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: 'pending' }) // pending, confirmed, paid, delivered, cancelled
    status: string;

    @Column()
    paymentMethod: string;

    @Column({ nullable: true })
    whatsappMessageId: string;

    @Column({ nullable: true })
    pagbankPaymentId: string;

    @Column({ nullable: true })
    pagbankQrCode: string;

    @Column({ nullable: true })
    pagbankPaymentUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}