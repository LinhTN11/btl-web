import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';
import './TransactionNote.css';

const TransactionNote = ({ onClose, editingTransaction, onTransactionAdded, onTransactionUpdated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    userId: user?._id
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        category: editingTransaction.category || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        note: editingTransaction.note || '',
        userId: editingTransaction.userId
      });
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const now = new Date();
      const [dateOnly] = formData.date.split('T');
      const [year, month, day] = dateOnly.split('-');
      
      // Combine selected date with current time
      const dateWithCurrentTime = new Date(
        year,
        month - 1,
        day,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: dateWithCurrentTime.toISOString(),
      };

      if (editingTransaction) {
        await expenseService.updateExpense(editingTransaction._id, transactionData);
        onTransactionUpdated && onTransactionUpdated();
      } else {
        await expenseService.createExpense(transactionData);
        onTransactionAdded && onTransactionAdded();
      }

      setFormData({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        userId: user?._id
      });
      
      onClose();
    } catch (err) {
      setError('Error saving transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang lưu...</div>;

  return (
    <div className="transaction-note-overlay">
      <div className="transaction-note">
        <div className="note-header">
          <h2>{editingTransaction ? 'Sửa giao dịch' : 'Ghi chép giao dịch'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số tiền</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Nhập số tiền (dương: thu nhập, âm: chi tiêu)"
              required
            />
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục</option>
              <option value="food">Ăn uống</option>
              <option value="transport">Di chuyển</option>
              <option value="entertainment">Giải trí</option>
              <option value="shopping">Mua sắm</option>
              <option value="bills">Hóa đơn</option>
              <option value="salary">Lương</option>
              <option value="bonus">Thưởng</option>
              <option value="investment">Đầu tư</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày giao dịch</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú"
              rows="3"
            />
          </div>

          <button type="submit" className="submit-button">
            {editingTransaction ? 'Cập nhật' : 'Lưu giao dịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionNote;