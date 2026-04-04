export type UpdateEventDto = {
  id: string;
  is_virtual: boolean;
  date_start: string;
  date_end: string;
  event_link: string | null;
  location: string | null;
  ressource_id: string;
  ressource: {
    title: string;
    description: string;
    tags: string[];
    status_id: string;
    confidentiality_type_id: string;
    type_id: string;
  };
};

export type ReturnEventDto = {
  id: string;
  is_virtual: boolean;
  date_start: string;
  date_end: string;
  event_link: string | null;
  location: string | null;
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
