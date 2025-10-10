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
    mediaId: number | null;
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

export interface Closet {
    id: number;
    userId: number;
    upperCategory: string,
    lowerCategory: string,
    accuracy: number;
    color: string;
    mediaId: number;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface Community {
    id: number;
    title: string;
    content: string;
    likeCount: number;
    userId: number;
    mediaId: number | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export interface CommunityComment {
    id: number;
    content: string;
    communityId: number;
    userId: number;
    commentId: number | null;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface Reactions {
    id: number;
    emoji: string;
    userId: number;
    communityId: number;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface Recommendations {
    location: string;
    closetId: number;
}