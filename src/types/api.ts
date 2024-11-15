interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
  links: {
    previous: string | null;
    current: string;
    next: string | null;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
}

export interface ApiResponse {
  meta: {
    pagination: Pagination;
  };
  data: User[];
} 