import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction } from '../features/transactionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import CategoryIcon from './CategoryIcon';
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

  return (
    <div className="transaction-list">
      <h2>Danh sách giao dịch</h2>
      <div className="transaction-items">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-date">{transaction.date}</div>
              <div className="transaction-category">
                <CategoryIcon category={transaction.category} />
                {transaction.note && <span className="transaction-note">{transaction.note}</span>}
              </div>
              <div className={`transaction-amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                {transaction.amount >= 0 ? '+' : '-'}{formatNumber(transaction.amount)}đ
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
