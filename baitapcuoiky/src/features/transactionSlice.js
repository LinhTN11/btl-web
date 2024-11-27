import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  totalIncome: 0,
  totalExpense: 0,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      if (action.payload.type === 'income') {
        state.totalIncome += action.payload.amount;
      } else {
        state.totalExpense += action.payload.amount;
      }
    },
    deleteTransaction: (state, action) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        if (transaction.type === 'income') {
          state.totalIncome -= transaction.amount;
        } else {
          state.totalExpense -= transaction.amount;
        }
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      }
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        // Remove old amounts
        if (oldTransaction.type === 'income') {
          state.totalIncome -= oldTransaction.amount;
        } else {
          state.totalExpense -= oldTransaction.amount;
        }
        // Add new amounts
        if (action.payload.type === 'income') {
          state.totalIncome += action.payload.amount;
        } else {
          state.totalExpense += action.payload.amount;
        }
        // Update transaction
        state.transactions[index] = action.payload;
      }
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
