import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import * as userService from '../../services/userService';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    console.log('getUsers');
    fastify.log.info('hello world');
    return userService.getUsers.apply(fastify.db);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await userService.getSingleUser.apply(fastify.db, [id]);
      if (!user) {
        throw this.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return userService.addUser.apply(fastify.db, [request.body]);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        const user = await userService.removeUser.apply(fastify.db, [id]);
        return user;
      } catch {
        throw this.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { userId } = request.body;
        const { id } = request.params;
        const user = await userService.subscribeTo.apply(fastify.db, [
          id,
          userId,
        ]);
        return user;
      } catch {
        throw this.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { userId } = request.body;
        const { id } = request.params;
        const newUser = await userService.unsubscribeFrom.apply(fastify.db, [
          id,
          userId,
        ]);
        return newUser;
      } catch {
        throw this.httpErrors.badRequest();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const { id } = request.params;
        const user = await userService.updateUser.apply(fastify.db, [
          id,
          request.body,
        ]);
        return user;
      } catch {
        throw this.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
