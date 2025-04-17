import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/member/login`,
        { email, password },
        { withCredentials: true }
      );

      const loginUser = response.data;
      localStorage.setItem("loginEmail", loginUser.email);
      localStorage.setItem("loginGrade", loginUser.grade);
      sessionStorage.setItem("loginUser", JSON.stringify(response.data));
      sessionStorage.setItem("email", loginUser.email);

      alert(`${loginUser.nickName}님 로그인 성공!`);
      window.location.href = "/";
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // 서버에서 전달한 에러 메시지를 alert으로 출력
        alert(err.response.data);
      } else {
        alert("❌ 로그인 중 알 수 없는 오류가 발생했습니다.");
        console.error(err);
      }
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
      </div>
    </div>
  );
};

export default Login;
