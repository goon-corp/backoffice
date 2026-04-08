export type CreateRessourceProgressionDto = Record<string, unknown>;
export type UpdateRessourceProgressionDto = Record<string, unknown>;
export type RessourceProgression = {
  ressource_id: string;
  user_id: string;
  is_aside: boolean;
  is_exploited: boolean;
};
