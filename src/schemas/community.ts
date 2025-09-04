import { FromSchema } from "json-schema-to-ts";

export const idParamSchema = {
  type: "object",
  properties: { communityId: { type: "integer", minimum: 1 } },
  required: ["communityId"],
} as const;

export const userIdParamSchema = {
  type: "object",
  properties: { userId: { type: "integer", minimum: 1 } },
  required: ["userId"],
} as const;

export const paginationQuerySchema = {
  type: "object",
  properties: {
    cursor: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    q: { type: "string" },
    tag: { type: "string" },
  },
} as const;

export const createPostBodySchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 120 },
    content: { type: "string", minLength: 1, maxLength: 10000 },
    tags: { type: "string" },
    mediaIds: { type: "array", items: { type: "integer", minimum: 1 }, maxItems: 10 },
  },
  required: ["title", "content"],
  additionalProperties: false,
} as const;

export const updatePostBodySchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 120 },
    content: { type: "string", minLength: 1, maxLength: 10000 },
    tags: { type: "string" },
    mediaIds: { type: "array", items: { type: "integer", minimum: 1 }, maxItems: 10 },
  },
  additionalProperties: false,
} as const;

export const createCommentBodySchema = {
  type: "object",
  properties: {
    content: { type: "string", minLength: 1, maxLength: 1000 },
  },
  required: ["content"],
  additionalProperties: false,
} as const;

export const commentListQuerySchema = {
  type: "object",
  properties: {
    cursor: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
  },
} as const;


export interface PostCommunityBody {
  title: string;
  content: string;
  tags?: string[];
  mediaIds?: number[];
}

export interface PatchCommunityBody {
  title?: string;
  content?: string;
  tags?: string[];
  mediaIds?: number[];
}

export interface PostCommentBody {
  content: string;
  mediaIds?: number[];
}


export type CreatePostBody = FromSchema<typeof createPostBodySchema>;
export type UpdatePostBody = FromSchema<typeof updatePostBodySchema>;
export type CreateCommentBody = FromSchema<typeof createCommentBodySchema>;
