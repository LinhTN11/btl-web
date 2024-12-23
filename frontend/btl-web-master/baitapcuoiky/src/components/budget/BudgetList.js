import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { monthlyLimitService } from '../../services/monthlyLimitService';
import './BudgetList.css';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
    updateRemainingDays();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await monthlyLimitService.getAllMonthlyLimits();
      setBudgets(response.data.data);
    } catch (err) {
      setError('Error fetching budgets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRemainingDays = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const days = Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
    setRemainingDays(days);
  };

  const handleEdit = (budget) => {
    navigate('/edit-budget', { state: { budget } });
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
      try {
        await monthlyLimitService.deleteMonthlyLimit(budgetId);
        fetchBudgets();
      } catch (err) {
        setError('Error deleting budget: ' + err.message);
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return 'utensils';
      case 'transport': return 'bus';
      case 'entertainment': return 'gamepad';
      case 'shopping': return 'shopping-bag';
      default: return 'ellipsis-h';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'food': return 'Ăn uống';
      case 'transport': return 'Di chuyển';
      case 'entertainment': return 'Giải trí';
      case 'shopping': return 'Mua sắm';
      default: return 'Khác';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="budget-list-container">
      <div className="budget-list-header">
        <h2>Danh sách ngân sách</h2>
        <div className="header-right">
          <p className="remaining-days">Còn lại {remainingDays} ngày trong tháng</p>
          <button 
            className="add-budget-button"
            onClick={() => navigate('/create-budget')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      <div className="budget-grid">
        {budgets.map((budget) => (
          <div key={budget._id} className="budget-card">
            <div className="budget-icon">
              <FontAwesomeIcon icon={getCategoryIcon(budget.category)} />
            </div>
            <div className="budget-info">
              <h3>{getCategoryName(budget.category)}</h3>
              <p className="budget-amount">{formatAmount(budget.limit)}</p>
              <p className={`remaining-amount ${budget.totalSpent > budget.limit ? 'over-budget' : ''}`}>
                {budget.totalSpent > budget.limit ? 'Vượt ngân sách: ' : 'Còn lại: '}
                {formatAmount(Math.abs(budget.limit - budget.totalSpent))}
              </p>
              {budget.note && (
                <div className="budget-note-tooltip">
                  {budget.note}
                </div>
              )}
              <div className="budget-dates">
                <span>Tháng {budget.month}/{budget.year}</span>
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
                onClick={() => handleDelete(budget._id)}
                title="Xóa"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetList;