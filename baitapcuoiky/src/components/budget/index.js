import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addBudget, updateBudget } from '../../features/budgetSlice';
import './index.css';

const BudgetForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editingBudget = location.state?.budget;

  const getCurrentMonthDates = () => {
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDate = lastDay.toISOString().split('T')[0];
    
    const remainingDays = Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
    return { startDate, endDate, remainingDays };
  };

  const { startDate, endDate} = getCurrentMonthDates();

  const [budgetData, setBudgetData] = useState({
    amount: '',
    category: 'food',
    startDate,
    endDate,
  });

  useEffect(() => {
    if (editingBudget) {
      setBudgetData(editingBudget);
    }
  }, [editingBudget]);

  const categories = [
    { id: 'food', name: 'Ăn uống', icon: 'utensils' },
    { id: 'transport', name: 'Di chuyển', icon: 'bus' },
    { id: 'entertainment', name: 'Giải trí', icon: 'gamepad' },
    { id: 'shopping', name: 'Mua sắm', icon: 'shopping-bag' },
    { id: 'other', name: 'Khác', icon: 'ellipsis-h' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBudget) {
      dispatch(updateBudget({
        ...budgetData,
        amount: parseFloat(budgetData.amount),
      }));
    } else {
      dispatch(addBudget({
        ...budgetData,
        id: Date.now().toString(),
        amount: parseFloat(budgetData.amount),
        createdAt: new Date().toISOString(),
      }));
    }
    navigate('/budgets');
  };

  return (
    <div className="budget-form-container">
      <h2>{editingBudget ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'}</h2>
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Số tiền:</label>
          <input
            type="number"
            name="amount"
            value={budgetData.amount}
            onChange={handleInputChange}
            required
            placeholder="Nhập số tiền"
          />
        </div>

        <div className="form-group">
          <label>Danh mục:</label>
          <div className="category-options">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-option ${budgetData.category === category.id ? 'selected' : ''}`}
                onClick={() => setBudgetData(prev => ({ ...prev, category: category.id }))}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingBudget ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/budgets')}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;