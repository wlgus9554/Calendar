import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './memberView.css';

function MemberView() {
  const [memberView, setView] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [mode, setMode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 로그인 정보
  const loginEmail = localStorage.getItem("loginEmail");
  const loginGrade = localStorage.getItem("loginGrade");
  const isAdmin = loginGrade === "admin";

  // ✅ 전달된 이메일
  const targetEmail = location.state?.email || loginEmail;

  useEffect(() => {
    // ❌ 로그인 안 됐을 때
    if (!loginEmail) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }
  
    // ❌ 일반 사용자가 타인 정보 접근 시
    if (!isAdmin && targetEmail !== loginEmail) {
      alert("본인의 정보만 조회할 수 있습니다.");
      return navigate("/");
    }
  
    // ✅ 데이터 불러오기
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/member/view.do?email=${targetEmail}`);
        setView(response.data);
      } catch (err) {
        setError(err.message || "에러 발생");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [targetEmail, loginEmail, isAdmin, navigate]);
  

  const handlePasswordCheck = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/member/checkPassword.do", {
        email: targetEmail,
        password: inputPassword,
      });

      if (res.data === true) {
        navigate(`/memberUpdate`, { state: { email: targetEmail, password: inputPassword } });
      } else {
        alert("❌ 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("비밀번호 확인 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleDeleteMember = async () => {
    if (!inputPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!window.confirm("정말 탈퇴하시겠습니까? 😢")) return;

    try {
      const res = await axios.post("http://localhost:8080/api/member/memberDelete.do", {
        email: targetEmail,
        password: inputPassword,
      });

      if (res.data === "success") {
        alert("회원 탈퇴가 완료되었습니다.");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/";
      } else {
        alert("❌ 탈퇴 실패. 비밀번호를 다시 확인해주세요.");
      }
    } catch (err) {
      alert("탈퇴 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 에러: {error}</p>;

  return (
    <div className="member-container">
      <h2 className="member-title">회원 상세 정보</h2>
      {memberView && (
        <div key={memberView.email}>
          <div className="member-profile">
            <img src={`http://localhost:8080${memberView.image}`} alt="프로필" className="member-image" />
          </div>

          <table className="member-table">
            <tbody>
              <tr><th>이메일</th><td>{memberView.email}</td></tr>
              <tr><th>이름</th><td>{memberView.name}</td></tr>
              <tr><th>닉네임</th><td>{memberView.nickName}</td></tr>
              <tr><th>생년월일</th><td>{memberView.birth?.slice(0, 10)}</td></tr>
              <tr><th>성별</th><td>{memberView.gender}</td></tr>
              <tr><th>전화번호</th><td>{memberView.tel}</td></tr>
              <tr><th>도시</th><td>{memberView.city}</td></tr>
              <tr><th>가입일</th><td>{memberView.regDate?.slice(0, 10)}</td></tr>
              <tr><th>마지막 로그인</th><td>{memberView.last_login?.slice(0, 10)}</td></tr>

              {isAdmin && (
                <>
                  <tr><th>등급</th><td>{memberView.grade}</td></tr>
                  <tr><th>상태</th><td>{memberView.status}</td></tr>
                </>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => { setMode("edit"); setShowPasswordPrompt(true); }}>
              ✏ 수정하기
            </button>
            <button
              onClick={() => { setMode("delete"); setShowPasswordPrompt(true); }}
              style={{ marginLeft: "10px", color: "red" }}
            >
              🗑 탈퇴하기
            </button>
          </div>

          {showPasswordPrompt && (
            <div style={{ marginTop: '15px' }}>
              <p>비밀번호를 입력하세요:</p>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              {mode === "edit" && (
                <button onClick={handlePasswordCheck} style={{ marginLeft: "10px" }}>
                  확인
                </button>
              )}
              {mode === "delete" && (
                <button onClick={handleDeleteMember} style={{ marginLeft: '10px', color: 'red' }}>
                  확인 후 탈퇴
                </button>
              )}
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '8px 20px',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔙 이전으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberView;
