import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUtensils, faBus, faGamepad, faShoppingBag, 
  faFileInvoiceDollar, faEllipsisH, faMoneyBillWave, 
  faStar, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { expenseService } from './services/expenseService';
import Dashboard from './components/dashboard/dashboard';
import Calendar from './components/calendar/Calendar';
import Header from './components/header';
import TransactionList from './components/transactionlist/TransactionList';
import TransactionNote from './components/transactionNote/TransactionNote';
import BudgetForm from './components/budget';
import BudgetList from './components/budget/BudgetList';
import Login from './components/login/login';
import OverAll from './components/overall/OverAll';
import './App.css';

library.add(
  faUtensils, faBus, faGamepad, faShoppingBag,
  faFileInvoiceDollar, faEllipsisH, faMoneyBillWave,
  faStar, faChartLine
);

const DashboardContent = ({ onEdit }) => {
  return (
    <div className="main-content">
      <OverAll />
    </div>
  );
};

const TransactionContent = ({ onEdit }) => {
  const { user } = useAuth();
  
  return (
    <div className="main-content">
      <div className="left-content">
        <Dashboard />
        <Calendar />
      </div>
      <div className="right-content">
        <TransactionList onEdit={onEdit} />
      </div>
    </div>
  );
};

const App = () => {
  const { user, logout } = useAuth();
  const [showTransactionNote, setShowTransactionNote] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionNote(true);
  };

  const handleNavClick = (item) => {
    if (!user && item !== 'login') {
      setShowLogin(true);
      return;
    }

    if (item === 'Ghi chép giao dịch') {
      setShowTransactionNote(true);
      setEditingTransaction(null);
    } else if (item === 'Ngân sách') {
      navigate('/budgets');
    } else if (item === 'Tổng quan') {
      navigate('/overall');
    } else if (item === 'Số giao dịch') {
      navigate('/transactions');
    }
  };

  const handleCloseTransactionNote = () => {
    setShowTransactionNote(false);
    setEditingTransaction(null);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  return (
    <div className="app">
      <Header 
        onNavClick={handleNavClick} 
        onLoginClick={() => setShowLogin(true)}
        user={user}
        onLogout={logout}
      />

      {showTransactionNote && (
        <TransactionNote 
          onClose={handleCloseTransactionNote}
          editingTransaction={editingTransaction}
        />
      )}

      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Routes>
        <Route path="/" element={<DashboardContent onEdit={handleEdit} />} />
        <Route path="/overall" element={<OverAll />} />
        <Route path="/transactions" element={<TransactionContent onEdit={handleEdit} />} />
        <Route path="/create-budget" element={<BudgetForm />} />
        <Route path="/edit-budget" element={<BudgetForm />} />
        <Route path="/budgets" element={<BudgetList />} />
      </Routes>
    </div>
  );
};


const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;