export type CreateArticleDto = Record<string, unknown>;

export type UpdateArticleDto = {
  content: string;
  ressource: {
    title: string;
    description: string;
    tags: string[];
    status_id: string;
    confidentiality_type_id: string;
    type_id: string;
  };
};

export type Article = {
  id: string;
  content: string | null;
  ressource_id: string;
};
