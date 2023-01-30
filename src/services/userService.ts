import DB from '../utils/DB/DB';
import type { CreateUserDTO, ChangeUserDTO } from '../utils/DB/entities/DBUsers';

export const UserService =(db: DB) => {

  const getUsers = async () => db.users.findMany();

  const getUserById = async (id: string) => db.users.findOne({ key: 'id', equals: id });
 
  const getUsersByIds = async (ids: string[]) => db.users.findMany({ key: 'id', equalsAnyOf: ids });

  const addUser = async (body: CreateUserDTO) => db.users.create(body);

  const updateUser = async (id: string, body: ChangeUserDTO) => db.users.change(id, body);

  const removeUser = async (id: string) => {
    const user = await db.users.delete(id);
    const subscribers = await db.users.findMany({
      key: 'subscribedToUserIds',
      inArray: id,
    });

    await Promise.all(
      subscribers.map(async (user) => {
        const { subscribedToUserIds } = user;
        const idx = subscribedToUserIds.findIndex((item) => item === id);
        if (idx === -1) return user;
        subscribedToUserIds.splice(idx, 1);
        return db.users.change(user.id, { subscribedToUserIds });
      })
    );

    const userPosts = await db.posts.findMany({ key: 'userId', equals: id });
    await Promise.all(userPosts.map(async (post) => db.posts.delete(post.id)));

    const userProfile = await db.profiles.findOne({
      key: 'userId',
      equals: id,
    });
    if (userProfile) await db.profiles.delete(userProfile.id);

    return user;
  };

  const subscribeTo = async (id: string, subscriberId: string) => {
    const user = await db.users.findOne({
      key: 'id',
      equals: subscriberId,
    });
    if (!user) {
      throw new Error('Bad request');
    }
    const { subscribedToUserIds } = user;
    subscribedToUserIds.push(id);
    return db.users.change(subscriberId, { subscribedToUserIds });
  };

  const unsubscribeFrom = async (id: string, subscriberId: string) => {
    const user = await db.users.findOne({
      key: 'id',
      equals: subscriberId,
    });
    if (!user) {
      throw new Error('Bad request');
    }
    const { subscribedToUserIds } = user;
    const idx = subscribedToUserIds.findIndex((item) => item === id);
    if (idx === -1) throw new Error('Bad request');
    subscribedToUserIds.splice(idx, 1);
    return db.users.change(subscriberId, { subscribedToUserIds });
  };

  const getUserSubscribedTo = async (id: string) => db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: id,
        })

  return {
    getUsers,
    getUserById,
    getUsersByIds,
    addUser,
    updateUser,
    removeUser,
    subscribeTo,
    unsubscribeFrom,
    getUserSubscribedTo,
  };
}
