import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const grade = localStorage.getItem("loginGrade");

  if (grade !== "admin") {
    alert("관리자만 접근할 수 있습니다.");
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAdmin;
