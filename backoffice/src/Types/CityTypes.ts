export type CreateCityDto = Record<string, unknown>;
export type UpdateCityDto = Record<string, unknown>;
export type City = {
  id: number;
  department_code: string | null;
  insee_code: string | null;
  zip_code: string | null;
  name: string | null;
  slug: string | null;
  gps_lat: number;
  gps_lng: number;
};
