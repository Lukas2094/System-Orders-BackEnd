import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from 'src/roles/roles.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ name: 'role_id' })
    roleId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
