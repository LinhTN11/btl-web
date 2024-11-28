import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budgets: [],
  nextOrder: 1,
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action) => {
      state.budgets.push({
        ...action.payload,
        order: state.nextOrder,
      });
      state.nextOrder += 1;
      // Sort budgets by order
      state.budgets.sort((a, b) => a.order - b.order);
    },
    removeBudget: (state, action) => {
      state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
    },
    updateBudget: (state, action) => {
      const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = {
          ...action.payload,
          order: state.budgets[index].order,
        };
      }
    },
  },
});

export const { addBudget, removeBudget, updateBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
