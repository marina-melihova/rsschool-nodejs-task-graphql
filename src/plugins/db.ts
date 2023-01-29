import fp from 'fastify-plugin';
import DB from '../utils/DB/DB';
import seedData from '../utils/seedData';

export default fp(async (fastify, options): Promise<void> => {
  const db = new DB();
  fastify.decorate('db', db);

  if (options?.seed) {
    console.log('options.seed :>> ', options?.seed);
    await seedData(fastify);
  }
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB;
  }
}
