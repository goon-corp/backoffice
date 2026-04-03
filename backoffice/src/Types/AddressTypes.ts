export type CreateAddressDto = Record<string, unknown>;
export type UpdateAddressDto = Record<string, unknown>;
export type Address = {
  id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  region_id: number;
  department_id: number;
  city_id: number;
  user_id: string;
};
