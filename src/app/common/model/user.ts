export interface Role {
    id?: number;
    roleName?: string;
    level: number;
}

export interface Group {
    id?: number;
    name: string;
}

export interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    last_login?: Date;
    is_active?: boolean;
    is_staff?: boolean;
    date_joined?: Date;
}
