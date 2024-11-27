import React from 'react';

const Header = ({ onNavClick }) => {
  const navItems = ['Tổng quan', 'Số giao dịch', 'Ghi chép giao dịch', 'Ngân sách', 'Đăng nhập'];

  return (
    <header className="header">
      <nav>
        <ul>
          {navItems.map((item, index) => (
            <li key={index} onClick={() => onNavClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
