import api from './api';

export const userService = {
  login: async (email, password) => {
    return api.post('/user/sign-in', { email, password });
  },
  
  register: async (userData) => {
    return api.post('/user/sign-up', userData);
  },

  updateUser: async (id, data) => {
    return api.put(`/user/update-user/${id}`, data);
  }
};