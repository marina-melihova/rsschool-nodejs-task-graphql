import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { MemberTypeService } from '../../services';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const memberTypeService = MemberTypeService(fastify.db);
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return memberTypeService.getMemberTypes();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function ({ params: { id } }, reply): Promise<MemberTypeEntity> {
      const memberType = await memberTypeService.getMemberTypeById(id);
      if (!memberType) {
        throw fastify.httpErrors.notFound('Member type not found');
      }
      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (
      { params: { id }, body },
      reply
    ): Promise<MemberTypeEntity> {
      try {
        const memberType = await memberTypeService.updateMemberType(id, body);
        return memberType;
      } catch {
        throw fastify.httpErrors.badRequest('Data is incorrect');
      }
    }
  );
};

export default plugin;
