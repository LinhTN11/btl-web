import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';
import CategoryIcon from '../CategoryIcon';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
  const { user } = useAuth(); // Add authcontext
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());

  useEffect(() => {
    if (user) { 
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses();
      // Filter transactions for current user
      const userTransactions = response.data.data.filter(t => t.userId === user._id);
      setTransactions(userTransactions);
    } catch (err) {
      setError('Error fetching transactions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by selected month and current user
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const selectedDate = new Date(selectedMonth);
    return (
      transactionDate.getMonth() === selectedDate.getMonth() &&
      transactionDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Calculate totals for current month
  const { totalIncome, totalExpense } = currentMonthTransactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      if (amount >= 0) {
        acc.totalIncome += amount;
      } else {
        acc.totalExpense += Math.abs(amount);
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchTransactions(); // Refresh list after delete
      } catch (err) {
        setError('Error deleting transaction: ' + err.message);
      }
    }
  };

  const formatNumber = (number) => {
    return Math.abs(number).toLocaleString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (!user) return <div>Vui lòng đăng nhập để xem giao dịch</div>;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="transaction-list">
      <h2>Danh sách giao dịch</h2>
      <div className="transaction-summary">
        <div className="summary-item income">
          <span>Tổng thu tháng {new Date(selectedMonth).getMonth() + 1}:</span>
          <span className="amount">+{formatNumber(totalIncome)}đ</span>
        </div>
        <div className="summary-item expense">
          <span>Tổng chi tháng {new Date(selectedMonth).getMonth() + 1}:</span>
          <span className="amount">-{formatNumber(totalExpense)}đ</span>
        </div>
      </div>
      <div className="transaction-items">
        {currentMonthTransactions.map((transaction) => (
          <div key={transaction._id} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-date">
                {formatDateTime(transaction.date)}
              </div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <div className="category-with-amount">
                    <CategoryIcon category={transaction.category} />
                    <div className={`transaction-amount ${Number(transaction.amount) >= 0 ? 'income' : 'expense'}`}>
                      {Number(transaction.amount) >= 0 ? '+' : '-'}
                      {formatNumber(transaction.amount)}đ
                    </div>
                  </div>
                </div>
                {transaction.note && (
                  <div className="transaction-note">{transaction.note}</div>
                )}
              </div>
            </div>
            <div className="transaction-actions">
              <button 
                className="action-button edit-button" 
                onClick={() => onEdit(transaction)}
                title="Sửa giao dịch"
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
              <button 
                className="action-button delete-button"
                onClick={() => handleDelete(transaction._id)}
                title="Xóa giao dịch"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;