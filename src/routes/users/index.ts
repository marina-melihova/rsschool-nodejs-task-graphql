import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { UserService } from './../../services/userService';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const userServise = UserService(fastify.db);
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return userServise.getUsers();
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
      const user = await userServise.getUserById(id);
      if (!user) {
        throw this.httpErrors.notFound('User not found');
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
      return userServise.addUser(request.body);
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
        const user = await userServise.removeUser(id);
        return user;
      } catch {
        throw this.httpErrors.badRequest("User's ID is incorrect");
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
        const {
          body: { userId },
          params: { id },
        } = request;
        const user = await userServise.subscribeTo(id, userId);
        return user;
      } catch {
        throw this.httpErrors.badRequest('ID is incorrect');
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
        const {
          body: { userId },
          params: { id },
        } = request;
        const newUser = await userServise.unsubscribeFrom(id, userId);
        return newUser;
      } catch {
        throw this.httpErrors.badRequest('ID is incorrect');
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
        const {
          body,
          params: { id },
        } = request;
        const user = await userServise.updateUser(id, body);
        return user;
      } catch {
        throw this.httpErrors.badRequest('Data is incorrect');
      }
    }
  );
};

export default plugin;
