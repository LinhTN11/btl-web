import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { removeBudget } from '../../features/budgetSlice';
import './BudgetList.css';

const BudgetList = () => {
  const budgets = useSelector((state) => state.budgets.budgets);
  const transactions = useSelector((state) => state.transactions.transactions);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateRemainingBudget = (budget) => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    
    const categoryTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.category === budget.category &&
        transaction.type === 'expense' &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });

    const totalSpent = categoryTransactions.reduce((sum, transaction) => 
      sum + transaction.amount, 0);

    return budget.amount - totalSpent;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
        return 'utensils';
      case 'transport':
        return 'bus';
      case 'entertainment':
        return 'gamepad';
      case 'shopping':
        return 'shopping-bag';
      default:
        return 'ellipsis-h';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleEdit = (budget) => {
    navigate('/edit-budget', { state: { budget } });
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
      dispatch(removeBudget(budgetId));
    }
  };

  return (
    <div className="budget-list-container">
      <div className="budget-list-header">
        <h2>Danh sách ngân sách</h2>
        <button 
          className="add-budget-button"
          onClick={() => navigate('/create-budget')}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="budget-grid">
        {budgets.map((budget) => {
          const remainingAmount = calculateRemainingBudget(budget);
          const isOverBudget = remainingAmount < 0;

          return (
            <div key={budget.id} className="budget-card">
              <div className="budget-icon">
                <FontAwesomeIcon icon={getCategoryIcon(budget.category)} />
              </div>
              <div className="budget-info">
                <h3>{budget.name}</h3>
                <p className="budget-amount">{formatAmount(budget.amount)}</p>
                <p className={`remaining-amount ${isOverBudget ? 'over-budget' : ''}`}>
                  {isOverBudget ? 'Vượt ngân sách: ' : 'Còn lại: '}
                  {formatAmount(Math.abs(remainingAmount))}
                </p>
                <div className="budget-dates">
                  <span>{formatDate(budget.startDate)}</span>
                  <span> - </span>
                  <span>{formatDate(budget.endDate)}</span>
                </div>
              </div>
              <div className="budget-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(budget)}
                  title="Chỉnh sửa"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(budget.id)}
                  title="Xóa"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;
