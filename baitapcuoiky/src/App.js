import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUtensils,
  faBus,
  faGamepad,
  faShoppingBag,
  faFileInvoiceDollar,
  faEllipsisH,
  faMoneyBillWave,
  faStar,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import Dashboard from './components/dashboard';
import Calendar from './components/Calendar';
import Header from './components/header';
import TransactionList from './components/TransactionList';
import TransactionNote from './components/transactionNote/TransactionNote';
import BudgetForm from './components/budget';
import BudgetList from './components/budget/BudgetList';
import './App.css';

library.add(
  faUtensils,
  faBus,
  faGamepad,
  faShoppingBag,
  faFileInvoiceDollar,
  faEllipsisH,
  faMoneyBillWave,
  faStar,
  faChartLine
);

const DashboardContent = ({ onEdit }) => {
  const { transactions, totalExpense } = useSelector((state) => state.transactions);
  return (
    <div className="main-content">
      <div className="left-content">
        <Dashboard totalExpense={totalExpense} />
        <Calendar transactions={transactions} />
      </div>
      <div className="right-content">
        <TransactionList onEdit={onEdit} />
      </div>
    </div>
  );
};

const App = () => {
  const [showTransactionNote, setShowTransactionNote] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionNote(true);
  };

  const handleNavClick = (item) => {
    if (item === 'Ghi chép giao dịch') {
      setShowTransactionNote(true);
      setEditingTransaction(null);
    } else if (item === 'Ngân sách') {
      navigate('/budgets');
    } else if (item === 'Tổng quan') {
      navigate('/');
    }
  };

  const handleCloseTransactionNote = () => {
    setShowTransactionNote(false);
    setEditingTransaction(null);
  };

  return (
    <div className="app">
      <Header onNavClick={handleNavClick} />
      {showTransactionNote && (
        <TransactionNote 
          onClose={handleCloseTransactionNote}
          editingTransaction={editingTransaction}
        />
      )}
      <Routes>
        <Route path="/" element={<DashboardContent onEdit={handleEdit} />} />
        <Route path="/create-budget" element={<BudgetForm />} />
        <Route path="/edit-budget" element={<BudgetForm />} />
        <Route path="/budgets" element={<BudgetList />} />
      </Routes>
    </div>
  );
};

export default App