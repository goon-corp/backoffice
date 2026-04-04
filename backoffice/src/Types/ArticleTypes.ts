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
  ressource: {
    id: string;
    title: string | null;
    description: string | null;
    thumbnail_id: string | null;
    status: { id: string; label: string };
    confidentiality_type: { id: string; label: string };
    type: { id: string; label: string };
    tags: { id: string; label: string }[] | null;
    like_count: number;
    favorite_count: number;
  };
};
