import Module from "../../lib/module";
import {
  createPostBodySchema,
  updatePostBodySchema,
  idParamSchema,
  userIdParamSchema,
  paginationQuerySchema,
  createCommentBodySchema,
  commentListQuerySchema,
} from "../../schemas/community";

import postCommunity from "./postCommunity.controller";
import getCommunity from "./getCommunity.controller";
import getCommunityById from "./getCommunityById.controller";
import getCommunityByUser from "./getCommunityByUser.controller";
import patchCommunity from "./patchCommunity.controller";
import deleteCommunity from "./deleteCommunity.controller";
import postComment from "./postComment.controller";
import getComments from "./getComments.controller";

import authHandler from '../../handlers/auth';

export default new Module("community", [
  {
    method: "POST",
    url: "/",
    preHandler: authHandler,
    schema: { body: createPostBodySchema, tags: ["community"] },
    handler: postCommunity,
  },
  {
    method: "GET",
    url: "/",
    preHandler: authHandler,
    schema: { querystring: paginationQuerySchema, tags: ["community"] },
    handler: getCommunity,
  },
  {
    method: "GET",
    url: "/:communityId",
    preHandler: authHandler,
    schema: { params: idParamSchema, tags: ["community"] },
    handler: getCommunityById,
  },
  {
    method: "GET",
    url: "/user/:userId",
    preHandler: authHandler,
    schema: { params: userIdParamSchema, tags: ["community"] },
    handler: getCommunityByUser,
  },
  {
    method: "PATCH",
    url: "/:communityId",
    preHandler: authHandler,
    schema: { params: idParamSchema, body: updatePostBodySchema, tags: ["community"] },
    handler: patchCommunity,
  },
  {
    method: "DELETE",
    url: "/:communityId",
    preHandler: authHandler,
    schema: { params: idParamSchema, tags: ["community"] },
    handler: deleteCommunity,
  },
  {
    method: "POST",
    url: "/:communityId/comments",
    preHandler: authHandler,
    schema: { params: idParamSchema, body: createCommentBodySchema, tags: ["comment"] },
    handler: postComment,
  },
  {
    method: "GET",
    url: "/:communityId/comments",
    preHandler: authHandler,
    schema: { params: idParamSchema, querystring: commentListQuerySchema, tags: ["comment"] },
    handler: getComments,
  },
]);
