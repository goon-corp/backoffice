export type CreateTagDto = {
  label: string | null;
};

export type UpdateTagDto = {
  label: string | null;
};

export type Tag = {
  id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  label: string | null;
};
