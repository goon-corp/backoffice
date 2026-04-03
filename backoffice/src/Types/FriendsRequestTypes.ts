export type CreateFriendsRequestDto = {
  user_receiver_id: string;
};

export type UpdateFriendsRequestDto = {
  request_status: string | null;
};

export type FriendsRequestInfoDto = {
  user_sender_id: string;
  user_receiver_id: string;
  request_status: string | null;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
};

export type GetFriendsRequestsParams = {
  UserSenderId?: string;
  UserReceiverId?: string;
  RequestStatus?: string;
  CreatedAt?: string;
  IsDeleted?: boolean;
  page?: number;
  size?: number;
};
