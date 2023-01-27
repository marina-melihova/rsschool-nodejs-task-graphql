import DB from '../utils/DB/DB';
import type { MemberTypeEntity } from '../utils/DB/entities/DBMemberTypes';

type ChangeMemberTypeDTO = Partial<Omit<MemberTypeEntity, 'id'>>;

export async function getMemberTypes(this: DB) {
  return this.memberTypes.findMany();
}

export async function getMemberType(this: DB, id: string) {
  return this.memberTypes.findOne({ key: 'id', equals: id });
}

export async function updateMemberType(this: DB, id: string, body: ChangeMemberTypeDTO) {
  return this.memberTypes.change(id, body);
}
