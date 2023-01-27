import DB from '../utils/DB/DB';
import type { PostEntity } from '../utils/DB/entities/DBPosts';

type CreatePostDTO = Omit<PostEntity, 'id'>;
type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>;

export async function getPosts(this: DB) {
  return this.posts.findMany();
}

export async function getSinglePost(this: DB, id: string) {
  return this.posts.findOne({ key: 'id', equals: id });
}

export async function addPost(this: DB, body: CreatePostDTO) {
  const user = this.users.findOne({ key: 'id', equals: body.userId });
  if (!user) {
    throw new Error('Bad request');
  }
  return this.posts.create(body);
}

export async function updatePost(this: DB, id: string, body: ChangePostDTO) {
  return this.posts.change(id, body);
}

export async function removePost(this: DB, id: string) {
  return this.posts.delete(id);
}
