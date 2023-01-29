import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { userType, postType, profileType, memberTypeType } from './types';
import {
  postService,
  userService,
  profileService,
  memberTypeService,
} from '../../../services';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, context) => {
        const user = await userService.getSingleUser.apply(context.fastify.db, [
          id,
        ]);
        if (!user) {
          throw context.httpErrors.notFound();
        }
        return user;
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (source, args, context) =>
        userService.getUsers.apply(context.fastify.db),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (source, args, context) =>
        profileService.getProfiles.apply(context.fastify.db),
    },
    profile: {
      type: profileType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (source, { id }, context) =>
        profileService.getSingleProfile.apply(context.fastify.db, [id]),
    },
    post: {
      type: postType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (source, { id }, context) => {
        const post = await postService.getSinglePost.apply(context.fastify.db, [
          id,
        ]);
        if (!post) {
          throw context.httpErrors.notFound();
        }
        return post;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (source, { userId }, context) =>
        postService.getPosts.apply(context.fastify.db),
    },
    memberType: {
      type: memberTypeType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (source, { id }, context) =>
        memberTypeService.getMemberType.apply(context.fastify.db, [id]),
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      resolve: (source, args, context) =>
        memberTypeService.getMemberTypes.apply(context.fastify.db),
    },
  }),
});
