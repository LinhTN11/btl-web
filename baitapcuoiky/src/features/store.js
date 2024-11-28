import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import budgetReducer from './budgetSlice';

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    budgets: budgetReducer,
  },
});

export default store;
