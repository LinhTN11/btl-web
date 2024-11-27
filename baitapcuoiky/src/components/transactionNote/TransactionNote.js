import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../../features/transactionSlice';
import './TransactionNote.css';

const TransactionNote = ({ onClose, editingTransaction }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        category: editingTransaction.category || '',
        date: editingTransaction.date,
        note: editingTransaction.note || ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      id: editingTransaction ? editingTransaction.id : Date.now(),
      type: formData.amount >= 0 ? 'income' : 'expense'
    };

    if (editingTransaction) {
      dispatch(updateTransaction(transaction));
    } else {
      dispatch(addTransaction(transaction));
    }

    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    onClose();
  };

  return (
    <div className="transaction-note-overlay">
      <div className="transaction-note">
        <div className="note-header">
          <h2>{editingTransaction ? 'Sửa giao dịch' : 'Ghi chép giao dịch'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
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