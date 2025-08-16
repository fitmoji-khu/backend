export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    image: string | null;
    created_at: Date;  
    deleted_at: Date | null;
};

export interface UserInfo {
    id: number;
    user_id: number;
    personal_color: string;
    style: string;
    height: number;
    weight: number;
    gender: string;
    birth_at: Date;
};