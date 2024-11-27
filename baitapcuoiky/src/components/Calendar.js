import React, { useState } from 'react';
import './Calendar.css'

const Calendar = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Tính ngày đầu tiên và số ngày trong tháng
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Tạo danh sách các ngày
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Tạo các ô trống trước ngày đầu tiên
  const blankDays = Array.from({ length: firstDayOfMonth }, () => null);

  // Gộp ô trống và ngày thành một mảng
  const calendarDays = [...blankDays, ...days];

  // Chia lịch thành từng tuần (7 ngày)
  const weeks = [];
  while (calendarDays.length > 0) {
    weeks.push(calendarDays.splice(0, 7));
  }

  // Hàm chuyển tháng
  const changeMonth = (direction) => {
    const newDate = new Date(year, month + direction);
    setCurrentDate(newDate);
  };

  // Hàm lấy tổng số tiền giao dịch trong ngày
  const getDayTransactions = (day) => {
    if (!day || !transactions) return null;
    
    const dayStart = new Date(year, month, day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(year, month, day + 1);
    dayEnd.setHours(0, 0, 0, 0);
    
    const dayTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= dayStart && transactionDate < dayEnd;
    });

    if (dayTransactions.length === 0) return null;

    const total = dayTransactions.reduce((sum, transaction) => {
      return transaction.type === 'expense' 
        ? sum - transaction.amount 
        : sum + transaction.amount;
    }, 0);

    return total;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>❮</button>
        <h3>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h3>
        <button onClick={() => changeMonth(1)}>❯</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>CN</th>
            <th>T2</th>
            <th>T3</th>
            <th>T4</th>
            <th>T5</th>
            <th>T6</th>
            <th>T7</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((day, i) => {
                const amount = getDayTransactions(day);
                return (
                  <td key={i} className={day ? '' : 'empty'}>
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        {amount !== null && (
                          <div className={`day-amount ${amount < 0 ? 'expense' : 'income'}`}>
                            {amount.toLocaleString()}đ
                          </div>
                        )}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
