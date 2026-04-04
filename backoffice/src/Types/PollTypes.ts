export type CreatePollDto = {
  ressource_id: string;
};

export type UpdatePollDto = {
  ressource: {
    title: string;
    description: string;
    tags: string[];
    status_id: string;
    confidentiality_type_id: string;
    type_id: string;
  };
  options: { id: string; option: string }[];
};

export type CreatePollOptionDto = {
  option: string | null;
  poll_id: string;
};

export type PollInfoDto = {
  id: string;
  vote_count: number;
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
