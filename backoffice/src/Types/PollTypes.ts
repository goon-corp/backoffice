export type CreatePollDto = {
  ressource_id: string;
};

export type UpdatePollDto = {
  vote_count: number;
};

export type CreatePollOptionDto = {
  option: string | null;
  poll_id: string;
};

export type PollInfoDto = {
  id: string;
  vote_count: number;
  ressource_id: string;
};
