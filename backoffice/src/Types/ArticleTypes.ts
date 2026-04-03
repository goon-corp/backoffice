export type CreateArticleDto = Record<string, unknown>;
export type UpdateArticleDto = Record<string, unknown>;
export type Article = {
  id: string;
  content: string | null;
  ressource_id: string;
};
