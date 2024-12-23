import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './login.css';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'login') {
                const response = await login(formData.email, formData.password);
                if (response.status === 'OK') {
                    onLoginSuccess(formData.email);
                    onClose();
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Mật khẩu không khớp!');
                    return;
                }

                const phoneNum = Number(formData.phone);
                if (isNaN(phoneNum) || formData.phone.length < 10) {
                    setError('Số điện thoại không hợp lệ!');
                    return;
                }

                const registerData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    phone: phoneNum 
                };

                console.log('Sending registration data:', registerData);
                const response = await register(registerData);
                console.log('Registration response:', response);

                if (response.status === 'OK') {
                    setActiveTab('login');
                    setError('Đăng ký thành công! Vui lòng đăng nhập.');
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        phone: ''
                    });
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const renderRegisterFields = () => (
        <>
            <div className="form-group">
                <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại (10 số)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    required
                />
            </div>
        </>
    );

    if (!isOpen) return null;

    return (
        <div className="login-overlay">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {activeTab === 'register' && renderRegisterFields()}
                    
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {activeTab === 'register' && (
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading 
                            ? 'Đang xử lý...' 
                            : (activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký')
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;