import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './gqlShema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      console.log('Hello, GraphQL!');
      const { query, mutation, variables } = request.body;
      return await graphql({
        schema,
        source: String(query || mutation),
        variableValues: variables,
        contextValue: { fastify, dataloaders: new WeakMap() },
      });
    }
  );
};

export default plugin;
