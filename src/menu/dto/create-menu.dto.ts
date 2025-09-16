import { IsArray, IsOptional } from "class-validator";
import { CreateSubmenuDto } from "src/submenu/dto/create-submenu.dto";
import { UpdateSubmenuDto } from "src/submenu/dto/update-submenu.dto";

// dto/create-menu.dto.ts
export class CreateMenuDto {
    name: string;
    path: string;
    icon: string;
    roleIds?: number[]; 

    @IsArray()
    @IsOptional()
    submenus?: CreateSubmenuDto[];
}

// dto/update-menu.dto.ts
export class UpdateMenuDto {
    name?: string;
    path?: string;
    icon?: string;
    roleIds?: number[];
    
    @IsArray()
    @IsOptional()
    submenus?: UpdateSubmenuDto[]
}
