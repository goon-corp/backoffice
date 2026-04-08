export type CreatePollOptionDto = {
  option: string | null;
  poll_id: string;
};

export type UpdatePollOptionDto = {
  option: string | null;
};

export type PollOptionInfoDto = {
  id: string;
  option: string | null;
  poll_id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
};
