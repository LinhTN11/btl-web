import api from './api';

export const expenseService = {
  getAllExpenses: async () => {
    return api.get('/expense/get-all');
  },

  createExpense: async (expenseData) => {
    return api.post('/expense/create-expense', expenseData);
  },

  updateExpense: async (id, data) => {
    return api.put(`/expense/update-expense/${id}`, data);
  },

  deleteExpense: async (id) => {
    return api.delete(`/expense/delete-expense/${id}`);
  }
};