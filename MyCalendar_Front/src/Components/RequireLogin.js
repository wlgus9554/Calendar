// components/RequireLogin.js
import React from "react";
import { useNavigate } from "react-router-dom";

const RequireLogin = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🚫 로그인 필요</h2>
      <p style={{ marginTop: "1rem" }}>
        이 페이지를 보려면 로그인이 필요합니다.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "1.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
};

export default RequireLogin;
