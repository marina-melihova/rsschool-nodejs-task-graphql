import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLOutputType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import DataLoader from 'dataloader';
import { ProfileEntity } from './../../../utils/DB/entities/DBProfiles';
// import { PostEntity } from './../../../utils/DB/entities/DBPosts';
import {
  ProfileService,
  PostService,
  UserService,
  MemberTypeService,
} from '../../../services';

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const profileType: GraphQLOutputType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLFloat) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberType: {
      type: new GraphQLNonNull(memberTypeType),
      resolve: async (source, args, { fastify }, info) => {
        const { memberTypeId } = source;
        const memberTypeService = MemberTypeService(fastify.db);
        return memberTypeService.getMemberTypeById(memberTypeId);
      },
    },
  }),
});

export const memberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const userType: GraphQLOutputType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (source, args, context) => {
        const {
          fastify: { db },
        } = context;
        const userServise = UserService(db);
        return userServise.getUsersByIds(source.subscribedToUserIds);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (source, args, context) => {
        const {
          fastify: { db },
        } = context;
        const userServise = UserService(db);
        return userServise.getUserSubscribedTo(source.id);
      },
    },
    profile: {
      type: profileType,
      resolve: async (source, args, { fastify, dataloaders }, info) => {
        const profileService = ProfileService(fastify.db);
        let dl = dataloaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            const rows = await profileService.getProfilesByUserIds(ids);
            const sortedInIdsOrder = ids.map((id: string) =>
              rows.find((row: ProfileEntity) => row.userId === id)
            );
            return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
        return dl.load(source.id);
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (source, args, { fastify }) => {
        const postService = PostService(fastify.db);
        return postService.getPostsByUserIds(source.id);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
  },
});

export const ChangeMemberTypeInput = new GraphQLInputObjectType({
  name: 'ChangeMemberTypeInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
