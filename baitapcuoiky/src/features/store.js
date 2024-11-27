import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});

export default store;
