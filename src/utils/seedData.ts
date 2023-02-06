import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import {
  generate_createUserDTO,
  generate_createProfileDTO,
  generate_createPostDTO,
} from '../../test/utils/fake';

const generateUsers = () => {
  const users = [];
  for (let i = 0; i < 15; i += 1) {
    const user = generate_createUserDTO();
    users.push(user);
  }
  return users;
};

const generateProfiles = (userIds: string[]) =>
  userIds.map((userId, idx) => {
    const memberTypeId = faker.helpers.arrayElement(['basic', 'business']);
    return generate_createProfileDTO(userId, memberTypeId);
  });

const generatePosts = (userIds: string[]) => {
  const posts = [];
  for (let i = 0; i < 25; i += 1) {
    const userId = faker.helpers.arrayElement(userIds);
    const post = generate_createPostDTO(userId);
    posts.push(post);
  }
  return posts;
};

export default async (fastify: FastifyInstance): Promise<void> => {
  const usersDTO = generateUsers();
  const users = await Promise.all(
    usersDTO.map(async (userDTO) => fastify.db.users.create(userDTO))
  );
  const userIds = users.map((user) => user.id);

  await Promise.all(
    users.map(async (user) => {
      const subscribedToUserIds = [];
      const allSubscribers = userIds.filter((id) => id !== user.id);
      for (let i = 0; i < 4; i += 1) {
        subscribedToUserIds.push(faker.helpers.arrayElement(allSubscribers));
      }
      return fastify.db.users.change(user.id, { subscribedToUserIds });
    })
  );

  const profilesDTO = generateProfiles(userIds);
  await Promise.all(
    profilesDTO.map(async (profileDTO) =>
      fastify.db.profiles.create(profileDTO)
    )
  );

  const postsDTO = generatePosts(userIds);
  await Promise.all(
    postsDTO.map(async (postDTO) => fastify.db.posts.create(postDTO))
  );
};
