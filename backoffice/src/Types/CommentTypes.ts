export type CreateCommentDto = Record<string, unknown>;
export type UpdateCommentDto = Record<string, unknown>;
export type Comment = {
  id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  content: string | null;
  comment_id: string | null;
  ressource_id: string;
  user_id: string;
};
