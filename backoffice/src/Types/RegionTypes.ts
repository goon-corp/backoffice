export type CreateRegionDto = Record<string, unknown>;
export type UpdateRegionDto = Record<string, unknown>;
export type Region = {
  id: number;
  code: string | null;
  name: string | null;
  slug: string | null;
};
