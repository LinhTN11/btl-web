import React from 'react';
import './dashboard.css';

const Dashboard = ({ totalExpense }) => {
  const balance = -totalExpense;

  const formatNumber = (number) => {
    return number.toLocaleString('vi-VN');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-item">
        <h3>Tổng chi</h3>
        <p className="expense">{formatNumber(totalExpense)}đ</p>
      </div>
      <div className="dashboard-item">
        <h3>Chênh lệch</h3>
        <p className={balance < 0 ? 'expense' : 'income'}>
          {formatNumber(balance)}đ
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
