import api from './api';

export const monthlyLimitService = {
  getAllMonthlyLimits: async () => {
    return api.get('/monthlyLimit/get-all');
  },

  createMonthlyLimit: async (monthlyLimitData) => {
    return api.post('/monthlyLimit/create-monthlyLimit', monthlyLimitData);
  },

  updateMonthlyLimit: async (id, data) => {
    return api.put(`/monthlyLimit/update-monthlyLimit/${id}`, data);
  },

  deleteMonthlyLimit: async (id) => {
    return api.delete(`/monthlyLimit/delete-monthlyLimit/${id}`);
  },

  getDetailMonthlyLimit: async (id) => {
    return api.get(`/monthlyLimit/details/${id}`);
  }
};