export type PaginatedResponse<T> = {
  items: T[];
  page_index: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_previous_page: boolean;
  has_next_page: boolean;
};
