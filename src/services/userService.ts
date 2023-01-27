import DB from '../utils/DB/DB';
import type { UserEntity } from '../utils/DB/entities/DBUsers';

type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>;
type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>;

export async function getUsers(this: DB) {
  return this.users.findMany();
}

export async function getSingleUser(this: DB, id: string) {
  return this.users.findOne({ key: 'id', equals: id });
}

export async function addUser(this: DB, body: CreateUserDTO) {
  return this.users.create(body);
}

export async function updateUser(this: DB, id: string, body: ChangeUserDTO) {
  return this.users.change(id, body);
}

export async function subscribeTo(this: DB, id: string, subscriberId: string) {
  const user = await this.users.findOne({ key: 'id', equals: subscriberId });
  if (!user) {
    throw new Error('Bad request');
  }
  const { subscribedToUserIds } = user;
  subscribedToUserIds.push(id);
  return this.users.change(subscriberId, { subscribedToUserIds });
}

export async function unsubscribeFrom(this: DB, id: string, subscriberId: string) {
  const user = await this.users.findOne({ key: 'id', equals: subscriberId });
  if (!user) {
    throw new Error('Bad request');
  }
  const { subscribedToUserIds } = user;
  const idx = subscribedToUserIds.findIndex(item => item === id);
  if (idx === -1) throw new Error('Bad request');
  subscribedToUserIds.splice(idx, 1);
  return this.users.change(subscriberId, { subscribedToUserIds });
}

export async function removeUser(this: DB, id: string) {
  const user = await this.users.delete(id);
  const subscribers = await this.users.findMany({ key: 'subscribedToUserIds', inArray: id });

  await Promise.all(
    subscribers.map(async user => {
      const { subscribedToUserIds } = user;
      const idx = subscribedToUserIds.findIndex(item => item === id);
      if (idx === -1) return user;
      subscribedToUserIds.splice(idx, 1);
      return this.users.change(user.id, { subscribedToUserIds });
    })
  );

  const userPosts = await this.posts.findMany({ key: 'userId', equals: id });
  await Promise.all(userPosts.map(async post => this.posts.delete(post.id)));

  const userProfile = await this.profiles.findOne({ key: 'userId', equals: id });
  if (userProfile) await this.profiles.delete(userProfile.id);

  return user;
}
