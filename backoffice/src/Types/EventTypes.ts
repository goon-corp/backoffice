export type UpdateEventDto = {
  id: string;
  is_virtual: boolean;
  date_start: string;
  date_end: string;
  event_link: string | null;
  location: string | null;
  ressource_id: string;
};

export type ReturnEventDto = {
  id: string;
  is_virtual: boolean;
  date_start: string;
  date_end: string;
  event_link: string | null;
  location: string | null;
};

export type ReturnEventMemberDto = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
};

export type GetEventMembersParams = {
  UserName?: string;
  page?: number;
  size?: number;
};
