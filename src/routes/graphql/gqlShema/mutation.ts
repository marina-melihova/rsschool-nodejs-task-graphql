import { GraphQLObjectType, GraphQLID, GraphQLNonNull } from 'graphql';
import {
  userType,
  postType,
  profileType,
  memberTypeType,
  CreateUserInput,
  ChangeUserInput,
  CreatePostInput,
  ChangePostInput,
  CreateProfileInput,
  ChangeProfileInput,
  ChangeMemberTypeInput,
} from './types';
import {
  postService,
  userService,
  profileService,
  memberTypeService,
} from '../../../services';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    addUser: {
      type: userType,
      args: { body: { type: new GraphQLNonNull(CreateUserInput) } },
      async resolve(source, { body }, context) {
        return userService.addUser.apply(context.fastify.db, [body]);
      },
    },
    editUser: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (source, { id, body }, context) => {
        try {
          const user = await userService.updateUser.apply(context.fastify.db, [
            id,
            body,
          ]);
          return user;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    subscribe: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, { id, subscriberId }, context) => {
        try {
          const user = await userService.subscribeTo.apply(context.fastify.db, [
            id,
            subscriberId,
          ]);
          return user;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    unsubscribe: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, { id, subscriberId }, context) => {
        try {
          const user = await userService.unsubscribeFrom.apply(context.fastify.db, [
            id,
            subscriberId,
          ]);
          return user;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    deleteUser: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, context) => {
        try {
          const user = await userService.removeUser.apply(context.fastify.db, [id]);
          return user;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    addPost: {
      type: postType,
      args: { body: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (source, { body }, context) => {
        return postService.addPost.apply(context.fastify.db, [body]);
      },
    },
    editPost: {
      type: postType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (source, { id, body }, context) => {
        try {
          const post = await postService.updatePost.apply(context.fastify.db, [
            id,
            body,
          ]);
          return post;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    deletePost: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, context) => {
        try {
          const post = await postService.removePost.apply(context.fastify.db, [id]);
          return post;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    addProfile: {
      type: profileType,
      args: { body: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (source, { body }, context) => {
        return profileService.addProfile.apply(context.fastify.db, [body]);
      },
    },
    editProfile: {
      type: profileType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (source, { id, body }, context) => {
        try {
          const profile = await profileService.updateProfile.apply(context.fastify.db, [
            id,
            body,
          ]);
          return profile;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    deleteProfile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, context) => {
        try {
          const profile = await profileService.removeProfile.apply(context.fastify.db, [
            id,
          ]);
          return profile;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
    editMemberType: {
      type: memberTypeType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeMemberTypeInput) },
      },
      resolve: async (source, { id, body }, context) => {
        try {
          const memberType = await memberTypeService.updateMemberType.apply(
            context.fastify.db,
            [id, body]
          );
          return memberType;
        } catch {
          throw context.httpErrors.badRequest();
        }
      },
    },
  }),
});
