export interface Media {
    id: number;
    key: string;
    type: string;
    createdAt: Date;
    deletedAt: Date;
}

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    image: string | null;
    createdAt: Date;  
    deletedAt: Date | null;
};

export interface UserInfo {
    id: number;
    userId: number;
    personalColor: string;
    style: string;
    height: number;
    weight: number;
    gender: string;
    birthAt: Date;
};
