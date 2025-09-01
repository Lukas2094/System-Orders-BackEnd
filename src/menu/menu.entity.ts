// menu.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "src/roles/roles.entity";

@Entity("menus")
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    path: string;

    @Column()
    icon: string;

    @ManyToMany(() => Role, role => role.menus)
    @JoinTable({
        name: "menu_roles",
        joinColumn: { name: "menu_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
    roles: Role[];
}
