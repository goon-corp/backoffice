export type CreateSessionDto = Record<string, unknown>;
export type UpdateSessionDto = Record<string, unknown>;
export type Session = {
  id: string;
  creation_time: string;
  update_time: string | null;
  id_ws: string | null;
  status: string | null;
  ressource_id: string;
};
