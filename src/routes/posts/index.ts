import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { PostService } from '../../services';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const postService = PostService(fastify.db);
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return postService.getPosts();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function ({ params: { id } }, reply): Promise<PostEntity> {
      const post = await postService.getPostById(id);
      if (!post) {
        throw fastify.httpErrors.notFound('Post not found');
      }
      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function ({ body }, reply): Promise<PostEntity> {
      try {
        const post = await postService.addPost(body);
        return post;
      } catch {
        throw fastify.httpErrors.badRequest('Data is incorrect');
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function ({ params: { id } }, reply): Promise<PostEntity> {
      try {
        const post = await postService.removePost(id);
        return post;
      } catch {
        throw fastify.httpErrors.badRequest('ID is incorrect');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function ({ params: { id }, body }, reply): Promise<PostEntity> {
      try {
        const post = await postService.updatePost(id, body);
        return post;
      } catch {
        throw fastify.httpErrors.badRequest('Data is incorrect');
      }
    }
  );
};

export default plugin;
