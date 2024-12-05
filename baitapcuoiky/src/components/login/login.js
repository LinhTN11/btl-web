import React, { useState, useEffect, useRef } from 'react';
import './login.css';

const Login = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeTab === 'login') {
            // Check credentials
            if (formData.email === 'admin123@gmail.com' && formData.password === '123456') {
                setUserEmail(formData.email);
                onClose();
                setError('');
            } else {
                setError('Email hoặc mật khẩu không đúng!');
            }
        } else {
            if (formData.password !== formData.confirmPassword) {
                setError('Mật khẩu không khớp!');
                return;
            }
            // Handle registration logic here
            console.log('Register with:', formData);
        }
    };

    const handleLogout = () => {
        setUserEmail(null);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="login-overlay">
            <div className="login-container">
                <div className={`login-header ${showDropdown ? 'expanded' : ''}`}>
                    <div className="login-tabs">
                        {userEmail ? (
                            <div className="user-info" ref={dropdownRef}>
                                <div className="user-avatar" onClick={toggleDropdown}>
                                    {userEmail.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-email" onClick={toggleDropdown}>{userEmail}</span>
                                {showDropdown && (
                                    <div className="user-dropdown">
                                        <button className="info-btn">Thông tin</button>
                                        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {!userEmail && (
                    <>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form">
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

                            <button type="submit" className="submit-btn">
                                {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
