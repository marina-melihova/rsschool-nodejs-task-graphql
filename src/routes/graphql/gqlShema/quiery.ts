import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { userType, postType, profileType, memberTypeType } from './types';
import {
  UserService,
  PostService,
  ProfileService,
  MemberTypeService,
} from '../../../services';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        const userServise = UserService(fastify.db);
        const user = await userServise.getUserById(id);
        if (!user) {
          throw fastify.httpErrors.notFound('User not found');
        }
        return user;
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (source, args, { fastify: { db } }) => {
        const userServise = UserService(db);
        return userServise.getUsers();
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (source, args, { fastify: { db } }) => {
        const profileService = ProfileService(db);
        return profileService.getProfiles();
      },
    },
    profile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        const profileService = ProfileService(fastify.db);
        const profile = await profileService.getProfileById(id);
        if (!profile) {
          throw fastify.httpErrors.notFound('Profile not found');
        }
        return profile;
      },
    },
    post: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        const postService = PostService(fastify.db);
        const post = await postService.getPostById(id);
        if (!post) {
          throw fastify.httpErrors.notFound('Post not found');
        }
        return post;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (source, { userId }, { fastify: { db } }) => {
        const postService = PostService(db);
        return postService.getPosts();
      },
    },
    memberType: {
      type: memberTypeType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, { fastify }) => {
        const memberTypeService = MemberTypeService(fastify.db);
        const memberType = memberTypeService.getMemberTypeById(id);
        if (!memberType) {
          throw fastify.httpErrors.notFound('Post not found');
        }
        return memberType;
      },
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      resolve: async (source, args, { fastify }) => {
        const memberTypeService = MemberTypeService(fastify.db);
        return memberTypeService.getMemberTypes();
      },
    },
  }),
});
