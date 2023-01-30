import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import {
  graphql,
  DocumentNode,
  parse,
  Source,
  validate,
  specifiedRules,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { graphqlBodySchema } from './schema';
import { schema } from './gqlShema';

const DEPTH_LIMIT = 6;

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
      const { query, variables } = request.body;
      const queryStr = String(query);
      let document: DocumentNode;
      try {
        document = parse(new Source(queryStr, 'GraphQL request'));
      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err.message);
      }

      const errors = validate(schema, document, [
        ...specifiedRules,
        depthLimit(DEPTH_LIMIT),
      ]);
      if (errors.length > 0) {
        reply.send({ errors, data: null });
        return;
      }

      return await graphql({
        schema,
        source: String(query),
        variableValues: variables,
        contextValue: { fastify, dataloaders: new WeakMap() },
      });
    }
  );
};

export default plugin;
