import DB from '../utils/DB/DB';
import type { ChangeMemberTypeDTO } from '../utils/DB/entities/DBMemberTypes';

export const MemberTypeService = (db: DB) => {
  const getMemberTypes = async () => db.memberTypes.findMany();

  const getMemberTypeById = async (id: string) =>
    db.memberTypes.findOne({ key: 'id', equals: id });

  const updateMemberType = async (id: string, body: ChangeMemberTypeDTO) =>
    db.memberTypes.change(id, body);
  return { getMemberTypes, getMemberTypeById, updateMemberType };
};
