import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { monthlyLimitService } from '../../services/monthlyLimitService';
import { useAuth } from '../../contexts/AuthContext';
import './index.css';

const BudgetForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingBudget = location.state?.budget;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentMonthDates = () => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };
  };

  const { month, year } = getCurrentMonthDates();

  const [budgetData, setBudgetData] = useState({
    category: 'food',
    month,
    year,
    limit: '',
    totalSpent: 0,
    note: '',
    userId: user?._id 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBudget) {
        await monthlyLimitService.updateMonthlyLimit(editingBudget._id, budgetData);
      } else {
        await monthlyLimitService.createMonthlyLimit(budgetData);
      }
      navigate('/budgets');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="budget-form-container">
      <h2>{editingBudget ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Số tiền:</label>
          <input
            type="number"
            name="limit"
            value={budgetData.limit}
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

        <div className="form-group">
          <label>Ghi chú:</label>
          <input
            type="text"
            name="note"
            value={budgetData.note}
            onChange={handleInputChange}
            placeholder="Thêm ghi chú"
            maxLength={200}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingBudget ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => navigate('/budgets')}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;