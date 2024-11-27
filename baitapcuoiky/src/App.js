import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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

const App = () => {
  const [showTransactionNote, setShowTransactionNote] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { transactions, totalExpense } = useSelector((state) => state.transactions);

  const handleNavClick = (item) => {
    if (item === 'Ghi chép giao dịch') {
      setShowTransactionNote(true);
      setEditingTransaction(null);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionNote(true);
  };

  const handleCloseTransactionNote = () => {
    setShowTransactionNote(false);
    setEditingTransaction(null);
  };

  return (
    <div className="app">
      <Header onNavClick={handleNavClick} />
      <div className="main-content">
        <div className="left-content">
          <Dashboard totalExpense={totalExpense} />
          <Calendar transactions={transactions} />
        </div>
        <div className="right-content">
          {showTransactionNote && (
            <TransactionNote 
              onClose={handleCloseTransactionNote}
              editingTransaction={editingTransaction}
            />
          )}
          <TransactionList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default App;
