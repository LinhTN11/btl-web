import React, { useRef, useState, useEffect } from 'react';
import './OverAll.css';
import { PieChart } from 'react-minimal-pie-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../contexts/AuthContext';

const OverAll = () => {
  const { user, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    birthdate: '',
    email: '',
    phone: ''
  });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        birthdate: user.birthdate || ''
      });
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses();
      // Filter transactions for current user
      const userTransactions = response.data.data.filter(t => t.userId === user?._id);
      setTransactions(userTransactions);
    } catch (err) {
      setError('Error fetching transactions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on date range and user
  const filteredTransactions = transactions.filter(transaction => {
    if (!dateRange.startDate || !dateRange.endDate) return true;
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Calculate total income and expenses
  const { totalIncome, totalExpense } = filteredTransactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (amount > 0) {
      acc.totalIncome += amount;
    } else {
      acc.totalExpense += Math.abs(amount);
    }
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  // Calculate spending by category for current user only
  const spendingByCategory = filteredTransactions
    .filter(t => Number(t.amount) < 0)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(Number(transaction.amount));
      return acc;
    }, {});

  // Convert spending data for pie chart
  const colors = ['#E38627', '#C13C37', '#6A2135', '#47B39C', '#6A4C93'];
  
  const categoryLabels = {
    food: 'Ăn uống',
    transport: 'Di chuyển',
    shopping: 'Mua sắm',
    entertainment: 'Giải trí',
    bills: 'Hóa đơn',
    other: 'Khác'
  };

  const spendingData = Object.entries(spendingByCategory).map(([category, value], index) => ({
    title: categoryLabels[category] || category,
    value: value,
    color: colors[index % colors.length]
  }));

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) return <div>Vui lòng đăng nhập để xem thống kê</div>;
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="overall-container">
      {/* User Information Card */}
      <div className="user-info-card">
        <div className="avatar-container" onClick={handleAvatarClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {avatar ? (
            <img src={avatar} alt="User avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <span>+</span>
            </div>
          )}
        </div>
        <div className="user-details">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={userData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Tuổi"
            value={userData.age}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="birthdate"
            placeholder="Ngày sinh"
            value={userData.birthdate}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={userData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Transaction Summary Card */}
      <div className="transaction-summary-card">
        <div className="summary-box">
          <h3>Tổng thu</h3>
          <p className="amount income">{totalIncome.toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="summary-box">
          <h3>Tổng chi</h3>
          <p className="amount expense">{totalExpense.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      {/* Spending Chart Card */}
      <div className="spending-chart-card">
        <div className="date-range-selector">
          <div className="date-input">
            <label>Từ ngày:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="date-input">
            <label>Đến ngày:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        
        {spendingData.length > 0 && (
          <div className="chart-container">
            <div className="chart-box pie-chart-box">
              <div className="chart-title">Phân Bổ Chi Tiêu</div>
              <PieChart
                data={spendingData}
                animate
                animationDuration={500}
                radius={45}
                lineWidth={60}
                startAngle={0}
                lengthAngle={360}
                paddingAngle={3}
                label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                labelStyle={{
                  fill: '#ffffff',
                  fontSize: '6px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold'
                }}
                labelPosition={70}
              />
              <div className="pie-chart-legend">
                {spendingData.map((data, index) => (
                  <div key={index} className="pie-legend-item">
                    <span 
                      className="color-box" 
                      style={{ backgroundColor: data.color }}
                    ></span>
                    <span>{data.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="chart-box bar-chart-box">
              <div className="chart-title">Chi Tiết Chi Tiêu</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={spendingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#FF9AA2" 
                    barSize={30}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverAll;