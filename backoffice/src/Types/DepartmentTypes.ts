export type CreateDepartmentDto = Record<string, unknown>;
export type UpdateDepartmentDto = Record<string, unknown>;
export type Department = {
  id: number;
  region_code: string | null;
  code: string | null;
  name: string | null;
  slug: string | null;
};
