import axios from 'axios';
import { User } from '../../types/api';

const API_URL = 'https://gorest.co.in/public/v2/users';

export const fetchUsers = async (page: number) => {
  const response = await axios.get<User[]>(`${API_URL}?page=${page}&per_page=20`);
  
  const messages = response.data.map((user) => ({
    id: user.id,
    content: `${user.name} (${user.status})`,
    isOutgoing: user.gender === 'male',
    timestamp: new Date().toISOString(),
    email: user.email,
    status: user.status
  }));

  // Get pagination info from headers
  const total = parseInt(response.headers['x-pagination-total'] || '0');
  const pages = parseInt(response.headers['x-pagination-pages'] || '0');
  const currentPage = parseInt(response.headers['x-pagination-page'] || '1');

  return {
    data: messages,
    pagination: {
      total,
      pages,
      page: currentPage,
      limit: 20
    }
  };
};