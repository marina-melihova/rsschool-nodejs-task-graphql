import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { ProfileService } from '../../services';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const profileService = ProfileService(fastify.db);
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return profileService.getProfiles();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function ({ params: { id } }, reply): Promise<ProfileEntity> {
      const profile = await profileService.getProfileById(id);
      if (!profile) {
        throw fastify.httpErrors.notFound('Profile not found');
      }
      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function ({ body }, reply): Promise<ProfileEntity> {
      try {
        const profile = await profileService.addProfile(body);
        return profile;
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
    async function ({ params: { id } }, reply): Promise<ProfileEntity> {
      try {
        const profile = await profileService.removeProfile(id);
        return profile;
      } catch {
        throw fastify.httpErrors.badRequest('ID is incorrect');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function ({ params: { id }, body }, reply): Promise<ProfileEntity> {
      try {
        const profile = await profileService.updateProfile(id, body);
        return profile;
      } catch {
        throw fastify.httpErrors.badRequest('Data is incorrect');
      }
    }
  );
};

export default plugin;
