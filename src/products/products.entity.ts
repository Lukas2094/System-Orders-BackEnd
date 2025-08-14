import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;

    @Column('int', { default: 0 })
    stock: number;

    @CreateDateColumn()
    createdAt: Date;
}
