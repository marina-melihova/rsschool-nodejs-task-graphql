import { GraphQLSchema } from 'graphql';
import { RootQuery } from './quiery';
import { Mutations } from './mutation';

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
