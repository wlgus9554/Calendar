import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("loginUser"));
  const loginEmail = localStorage.getItem("loginEmail");
  const grade = localStorage.getItem("loginGrade");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loginUser");
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("loginGrade");
    window.location.href = '/';
  };

  const handleMyPage = () => {
    if (loginEmail) {
      navigate('/memberView', { state: { email: loginEmail } });
    } else {
      alert("로그인 정보가 없습니다.");
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? '▶' : '◀'}
      </button>

      <ul>
        <li>
          <Link to="/"><span className="icon">🏠</span> {!collapsed && '메인'}</Link>
        </li>

        {!user && (
            <>
          <li>
            <Link to="/login"><span className="icon">🔐</span> {!collapsed && '로그인'}</Link>
          </li>
          <li>
            <Link to="/join"><span className="icon">📝</span> {!collapsed && '회원가입'}</Link>
          </li>
            </>
        )}

        {user && grade === 'user' && (
          <>
            <li>
              <Link to="/calendar"><span className="icon">📅</span> {!collapsed && '캘린더'}</Link>
            </li>
            <li>
              <button onClick={handleMyPage} className="sidebar-btn">
                <span className="icon">👤</span> {!collapsed && '내 정보'}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="sidebar-btn">
                <span className="icon">🚪</span> {!collapsed && '로그아웃'}
              </button>
            </li>
          </>
        )}

        {user && grade === 'admin' && (
          <>
            <li>
              <Link to="/calendar"><span className="icon">📅</span> {!collapsed && '캘린더'}</Link>
            </li>
            <li>
              <button onClick={() => navigate('/memberList')} className="sidebar-btn">
                <span className="icon">📋</span> {!collapsed && '회원 목록'}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="sidebar-btn">
                <span className="icon">🚪</span> {!collapsed && '로그아웃'}
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
