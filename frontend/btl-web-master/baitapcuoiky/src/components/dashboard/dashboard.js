import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';
import './dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Lấy dữ liệu giao dịch từ API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses();
      // current user transactionc. z
      const userTransactions = response.data.data.filter(t => t.userId === user._id);
      setTransactions(userTransactions);
    } catch (err) {
      setError('Error fetching transactions: ' + err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc thu nhập và chi tiêu
  const incomes = transactions.filter(t => Number(t.amount) > 0);
  const expenses = transactions.filter(t => Number(t.amount) < 0);

  // Tính tổng thu nhập
  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Tính tổng chi tiêu
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  
  // Tính số dư
  const balance = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Hàm định dạng số tiền 
  const formatNumber = (number) => {
    return Math.abs(number).toLocaleString('vi-VN');
  };

  if (!user) return null;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-item">
        <h3>Tổng thu</h3>
        <p className="income">{formatNumber(totalIncome)}đ</p>
      </div>
      <div className="dashboard-item">
        <h3>Tổng chi</h3>
        <p className="expense">{formatNumber(totalExpense)}đ</p>
      </div>
      <div className="dashboard-item">
        <h3>Số dư</h3>
        <p className={`balance ${balance < 0 ? 'expense' : 'income'}`}>
          {balance < 0 ? '-' : ''}{formatNumber(Math.abs(balance))}đ
        </p>
      </div>
    </div>
  );
};

export default Dashboard;