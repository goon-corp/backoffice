export type UpdateRessourceDto = {
  title: string | null;
  description: string | null;
  tags: string[] | null;
  status_id: string;
  confidentiality_type_id: string;
  type_id: string;
};

export type RessourceStatusInfoDto = {
  id: string;
  label: string | null;
};

export type RessourceConfidentialityTypeInfoDto = {
  id: string;
  label: string | null;
};

export type RessourceTypeInfoDto = {
  id: string;
  label: string | null;
};

export type ReturnTagDto = {
  id: string;
  label: string | null;
};

export type ReturnRessourceDto = {
  id: string;
  title: string | null;
  description: string | null;
  thumbnail_id: string | null;
  status: RessourceStatusInfoDto;
  confidentiality_type: RessourceConfidentialityTypeInfoDto;
  type: RessourceTypeInfoDto;
  tags: ReturnTagDto[] | null;
};

export type GetRessourcesParams = {
  page?: number;
  size?: number;
  IsDeleted?: boolean;
  RessourceTitle?: string;
  RessourceType?: string;
};

export type RessourceMedia = {
  id: string;
  media_url: string | null;
  mime_type: string | null;
};
