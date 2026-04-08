import { api } from "../lib/axios";
import type {
  UpdateRessourceDto,
  RessourceStatusInfoDto,
  RessourceConfidentialityTypeInfoDto,
  RessourceTypeInfoDto,
  ReturnRessourceDto,
  GetRessourcesParams,
  RessourceMedia,
} from "../Types/RessourceTypes";
import type { PaginatedResponse } from "../Types/PaginatedResponse";

export const ressourceService = {
  getAll: async (params?: GetRessourcesParams): Promise<PaginatedResponse<ReturnRessourceDto>> => {
    const response = await api.get("/api/ressources", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ReturnRessourceDto> => {
    const response = await api.get(`/api/ressources/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateRessourceDto): Promise<ReturnRessourceDto> => {
    const response = await api.put(`/api/ressources/${id}`, data);
    return response.data;
  },

  create: async (formData: FormData): Promise<ReturnRessourceDto> => {
    const response = await api.post("/api/ressources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getConfidentialityTypes: async (): Promise<RessourceConfidentialityTypeInfoDto[]> => {
    const response = await api.get("/api/ressource-confidentiality-types");
    return response.data;
  },

  getStatuses: async (): Promise<RessourceStatusInfoDto[]> => {
    const response = await api.get("/api/ressource-statuses");
    return response.data;
  },

  getTypes: async (): Promise<RessourceTypeInfoDto[]> => {
    const response = await api.get("/api/ressource-types");
    return response.data;
  },

  uploadMedia: async (formData: FormData): Promise<RessourceMedia> => {
    const response = await api.post("/api/ressource-medias", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getMedia: async (mediaId: string): Promise<RessourceMedia> => {
    const response = await api.get(`/api/ressource-medias/${mediaId}`);
    return response.data;
  },
};
