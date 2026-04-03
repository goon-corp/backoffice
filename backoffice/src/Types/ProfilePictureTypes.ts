export type CreateProfilePictureDto = Record<string, unknown>;
export type UpdateProfilePictureDto = Record<string, unknown>;
export type ProfilePicture = {
  id: string;
  update_time: string | null;
  deletion_time: string | null;
  creation_time: string;
  image_url: string | null;
  user_id: string;
};
