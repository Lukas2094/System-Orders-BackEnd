// dto/create-menu.dto.ts
export class CreateMenuDto {
    name: string;
    path: string;
    icon: string;
    roleIds?: number[]; 
}

// dto/update-menu.dto.ts
export class UpdateMenuDto {
    name?: string;
    path?: string;
    icon?: string;
    roleIds?: number[]; 
}
