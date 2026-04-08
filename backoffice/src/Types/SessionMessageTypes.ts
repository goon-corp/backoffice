export type CreateSessionMessageDto = Record<string, unknown>;
export type UpdateSessionMessageDto = Record<string, unknown>;
export type SessionMessage = {
  id: string;
  sent_time: string;
  content: string | null;
  user_id: string;
  session_id: string;
};
