import DB from '../utils/DB/DB';
import type { ProfileEntity } from '../utils/DB/entities/DBProfiles';

type CreateProfileDTO = Omit<ProfileEntity, 'id'>;
type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>;

export async function getProfiles(this: DB) {
  return this.profiles.findMany();
}

export async function getProfilesByUserIds(this: DB, ids: string[]) {
  return this.profiles.findMany({ key: 'userId', equalsAnyOf: ids });
}

export async function getProfileById(this: DB, id: string) {
  return this.profiles.findOne({ key: 'id', equals: id });
}
let i = 0;
export async function getProfileByUserId(this: DB, id: string) {
  console.log('Request to DB getProfileByUserId #', ++i);
  return this.profiles.findOne({ key: 'userId', equals: id });
}

export async function addProfile(this: DB, body: CreateProfileDTO) {
  const { userId, memberTypeId } = body;
  const existProfile = await this.profiles.findOne({
    key: 'userId',
    equals: userId,
  });
  if (existProfile) throw new Error('Bad request');
  const user = await this.users.findOne({ key: 'id', equals: userId });
  if (!user) {
    throw new Error('Bad request');
  }
  const memberType = await this.memberTypes.findOne({
    key: 'id',
    equals: memberTypeId,
  });
  if (!memberType) {
    throw new Error('Bad request');
  }
  return this.profiles.create(body);
}

export async function updateProfile(
  this: DB,
  id: string,
  body: ChangeProfileDTO
) {
  return this.profiles.change(id, body);
}

export async function removeProfile(this: DB, id: string) {
  return this.profiles.delete(id);
}
