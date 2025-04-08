import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css'; // 스타일 분리 가능

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
