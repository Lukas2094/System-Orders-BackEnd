// menu.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { Menu } from "./menu.entity";
import { Role } from "src/roles/roles.entity";
import { WebsocketModule } from "src/websocket/websocket.module"; 
import { Submenu } from "src/submenu/submenu.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Menu, Submenu , Role]), WebsocketModule],
    providers: [MenuService],
    controllers: [MenuController]
})
export class MenuModule { }
