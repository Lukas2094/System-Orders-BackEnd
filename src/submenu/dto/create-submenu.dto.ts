// create-submenu.dto.ts
export class CreateSubmenuDto {
    name: string;
    path: string;
    icon: string;
    menuId: number;
    roleIds?: number[];
}
