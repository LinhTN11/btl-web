import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction } from '../../features/transactionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import CategoryIcon from '../CategoryIcon';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const formatNumber = (number) => {
    return Math.abs(number).toLocaleString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="transaction-list">
      <h2>Danh sách giao dịch</h2>
      <div className="transaction-items">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-date">{formatDateTime(transaction.date)}</div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <div className="category-with-amount">
                    <CategoryIcon category={transaction.category} />
                    <div className={`transaction-amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                      {transaction.amount >= 0 ? '+' : '-'}{formatNumber(transaction.amount)}đ
                    </div>
                  </div>
                </div>
                {transaction.note && <div className="transaction-note">{transaction.note}</div>}
              </div>
            </div>
            <div className="transaction-actions">
              <button 
                className="action-button edit-button" 
                onClick={() => onEdit(transaction)}
                title="Sửa giao dịch"
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
              <button 
                className="action-button delete-button"
                onClick={() => handleDelete(transaction.id)}
                title="Xóa giao dịch"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;