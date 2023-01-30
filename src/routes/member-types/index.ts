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
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;
      const memberType = await memberTypeService.getMemberTypeById(id);
      if (!memberType) {
        throw fastify.httpErrors.notFound();
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
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        const { id } = request.params;
        const memberType = await memberTypeService.updateMemberType(
          id,
          request.body
        );
        return memberType;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
