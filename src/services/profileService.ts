import DB from '../utils/DB/DB';
import type {
  CreateProfileDTO,
  ChangeProfileDTO,
} from '../utils/DB/entities/DBProfiles';

export const ProfileService = (db: DB) => {
  const getProfiles = async () => db.profiles.findMany();

  const getProfilesByUserIds = async (ids: string[]) =>
    db.profiles.findMany({ key: 'userId', equalsAnyOf: ids });

  const getProfileById = async (id: string) =>
    db.profiles.findOne({ key: 'id', equals: id });

  const getProfileByUserId = async (id: string) =>
    db.profiles.findOne({ key: 'userId', equals: id });

  const addProfile = async (body: CreateProfileDTO) => {
    const { userId, memberTypeId } = body;
    const existProfile = await db.profiles.findOne({
      key: 'userId',
      equals: userId,
    });
    if (existProfile) throw new Error('Bad request');
    const user = await db.users.findOne({ key: 'id', equals: userId });
    if (!user) {
      throw new Error('Bad request');
    }
    const memberType = await db.memberTypes.findOne({
      key: 'id',
      equals: memberTypeId,
    });
    if (!memberType) {
      throw new Error('Bad request');
    }
    return db.profiles.create(body);
  };

  const updateProfile = async (id: string, body: ChangeProfileDTO) =>
    db.profiles.change(id, body);

  const removeProfile = async (id: string) => db.profiles.delete(id);

  return {
    getProfiles,
    getProfilesByUserIds,
    getProfileById,
    getProfileByUserId,
    addProfile,
    updateProfile,
    removeProfile,
  };
};
