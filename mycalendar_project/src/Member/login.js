import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/member/login',
        { email, password },
        { withCredentials: true }
      );

      const loginUser = response.data;
      localStorage.setItem("loginEmail", loginUser.email);
      localStorage.setItem("loginGrade", loginUser.grade);
      sessionStorage.setItem("loginUser", JSON.stringify(response.data));
      sessionStorage.setItem("email", loginUser.email);

      alert(`${response.data.nickName}님 로그인 성공!`);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔐 로그인</h2>
        <label>이메일</label>
        <input
          type="text"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>로그인</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
