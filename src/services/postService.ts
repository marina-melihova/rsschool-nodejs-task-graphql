import DB from '../utils/DB/DB';
import type {
  CreatePostDTO,
  ChangePostDTO,
} from '../utils/DB/entities/DBPosts';

export const PostService = (db: DB) => {
  const getPosts = async () => db.posts.findMany();

  const getPostsByUserIds = async (id: string) =>
    db.posts.findMany({ key: 'userId', equals: id });

  const getPostById = async (id: string) =>
    db.posts.findOne({ key: 'id', equals: id });

  const addPost = async (body: CreatePostDTO) => {
    const user = db.users.findOne({ key: 'id', equals: body.userId });
    if (!user) {
      throw new Error('Bad request');
    }
    return db.posts.create(body);
  };

  const updatePost = async (id: string, body: ChangePostDTO) =>
    db.posts.change(id, body);

  const removePost = async (id: string) => db.posts.delete(id);

  return {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    removePost,
    getPostsByUserIds,
  };
};
