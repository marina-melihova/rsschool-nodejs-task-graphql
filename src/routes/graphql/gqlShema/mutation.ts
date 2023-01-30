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
  UserService,
  PostService,
  ProfileService,
  MemberTypeService,
} from '../../../services';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    addUser: {
      type: userType,
      args: { body: { type: new GraphQLNonNull(CreateUserInput) } },
      async resolve(source, { body }, context) {
        const {
          fastify: { db },
        } = context;
        const userServise = UserService(db);
        return userServise.addUser(body);
      },
    },
    editUser: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (source, { id, body }, { fastify }) => {
        try {
          const userServise = UserService(fastify.db);
          const user = await userServise.updateUser(id, body);
          return user;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    subscribe: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, { id, subscriberId }, { fastify }) => {
        try {
          const userServise = UserService(fastify.db);
          const user = await userServise.subscribeTo(id, subscriberId);
          return user;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    unsubscribe: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, { id, subscriberId }, { fastify }) => {
        try {
          const userServise = UserService(fastify.db);
          const user = await userServise.unsubscribeFrom(id, subscriberId);
          return user;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    deleteUser: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        try {
          const userServise = UserService(fastify.db);
          const user = await userServise.removeUser(id);
          return user;
        } catch {
          throw fastify.httpErrors.badRequest('ID id incorrect');
        }
      },
    },
    addPost: {
      type: postType,
      args: { body: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (source, { body }, { fastify: { db } }) => {
        const postService = PostService(db);
        return postService.addPost(body);
      },
    },
    editPost: {
      type: postType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (source, { id, body }, { fastify }) => {
        try {
          const postService = PostService(fastify.db);
          const post = await postService.updatePost(id, body);
          return post;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    deletePost: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        try {
          const postService = PostService(fastify.db);
          const post = await postService.removePost(id);
          return post;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    addProfile: {
      type: profileType,
      args: { body: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (source, { body }, context) => {
        const {
          fastify: { db },
        } = context;
        const profileService = ProfileService(db);
        return profileService.addProfile(body);
      },
    },
    editProfile: {
      type: profileType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (source, { id, body }, { fastify }) => {
        try {
          const profileService = ProfileService(fastify.db);
          const profile = await profileService.updateProfile(id, body);
          return profile;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    deleteProfile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        try {
          const profileService = ProfileService(fastify.db);
          const profile = await profileService.removeProfile(id);
          return profile;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
    editMemberType: {
      type: memberTypeType,
      args: {
        id: { type: GraphQLID },
        body: { type: new GraphQLNonNull(ChangeMemberTypeInput) },
      },
      resolve: async (source, { id, body }, { fastify }) => {
        try {
          const memberTypeService = MemberTypeService(fastify.db);
          const memberType = await memberTypeService.updateMemberType(id, body);
          return memberType;
        } catch {
          throw fastify.httpErrors.badRequest();
        }
      },
    },
  }),
});
