import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('whatsapp_messages')
export class WhatsAppMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    messageId: string;

    @Column()
    from: string;

    @Column()
    to: string;

    @Column('text')
    body: string;

    @Column({ default: 'received' }) // received, sent
    direction: string;

    @Column({ default: 'text' }) // text, image, order
    type: string;

    @Column({ nullable: true })
    orderId: number;

    @Column({ default: 'pending' }) // pending, processed, error
    status: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'json', nullable: true })
    metadata: any;
}