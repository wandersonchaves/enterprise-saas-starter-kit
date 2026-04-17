import { apiRequest } from './api';
import { LoginRequest, RegisterRequest } from '@enterprise/common';

export const authService = {
  async login(data: LoginRequest) {
    const response = await apiRequest<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }
    
    return response;
  },

  async register(data: RegisterRequest) {
    const response = await apiRequest<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }
    
    return response;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('organization-id');
    }
  }
};
