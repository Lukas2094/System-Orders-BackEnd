// submenu.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Menu } from "src/menu/menu.entity";
import { Role } from "src/roles/roles.entity";

@Entity("submenus")
export class Submenu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    path: string;

    @Column()
    icon: string;

    @ManyToOne(() => Menu, menu => menu.submenus)
    menu: Menu;

    @ManyToMany(() => Role, role => role.submenus)
    @JoinTable({
        name: "submenu_roles",
        joinColumn: { name: "submenu_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
        
        
    roles: Role[];
}
