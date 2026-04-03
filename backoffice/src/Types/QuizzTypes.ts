export type CreateQuizzDto = {
  ressource_id: string;
};

export type UpdateQuizzDto = Record<string, unknown>;
export type QuizzInfoDto = {
  id: string;
  participation_count: number;
  ressource_id: string;
};
