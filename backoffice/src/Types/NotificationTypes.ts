export type CreateNotificationDto = Record<string, unknown>;
export type UpdateNotificationDto = Record<string, unknown>;
export type Notification = {
  id: string;
  creation_time: string;
  update_time: string | null;
  marked_as_read: boolean;
  content: string | null;
  user_id: string;
};
