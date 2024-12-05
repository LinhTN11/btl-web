import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],  // Danh sách giao dịch
  totalIncome: 0,    // Tổng thu nhập
  totalExpense: 0,   // Tổng chi tiêu
  filters: {
    category: null,  // Bộ lọc danh mục
    startDate: null, // Bộ lọc ngày bắt đầu
    endDate: null,   // Bộ lọc ngày kết thúc
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Thêm giao dịch mới
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      if (action.payload.type === 'income') {
        state.totalIncome += action.payload.amount;
      } else {
        state.totalExpense += action.payload.amount;
      }
    },
    
    // Xóa giao dịch theo ID
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
    
    // Cập nhật giao dịch
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        // Xóa số tiền giao dịch cũ khỏi tổng
        if (oldTransaction.type === 'income') {
          state.totalIncome -= oldTransaction.amount;
        } else {
          state.totalExpense -= oldTransaction.amount;
        }
        // Cộng số tiền giao dịch mới vào tổng
        if (action.payload.type === 'income') {
          state.totalIncome += action.payload.amount;
        } else {
          state.totalExpense += action.payload.amount;
        }
        // Cập nhật giao dịch
        state.transactions[index] = action.payload;
      }
    },

    // Thiết lập bộ lọc (danh mục, ngày bắt đầu, ngày kết thúc)
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    // Xóa bộ lọc hiện tại
    clearFilters: (state) => {
      state.filters = {
        category: null,
        startDate: null,
        endDate: null,
      };
    },
  },
});

// Selector hỗ trợ lấy dữ liệu đã lọc
export const selectFilteredTransactions = (state) => {
  const { transactions, filters } = state.transactions;
  return transactions.filter((transaction) => {
    const { category, startDate, endDate } = filters;
    const transactionDate = new Date(transaction.date);

    const matchesCategory = category ? transaction.category === category : true;
    const matchesStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? transactionDate <= new Date(endDate) : true;

    return matchesCategory && matchesStartDate && matchesEndDate;
  });
};

// Export các action
export const { 
  addTransaction, 
  deleteTransaction, 
  updateTransaction, 
  setFilters, 
  clearFilters 
} = transactionSlice.actions;

// Export reducer
export default transactionSlice.reducer;
