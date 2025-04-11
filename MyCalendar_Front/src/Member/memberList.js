import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import './memberList.css'; // ✅ 스타일 추가

function MemberList() {
  const [memberList, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/member/memberList.do');
        setList(response.data);
      } catch (err) {
        setError(err.message || '에러 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  const submit = (email) => {
    console.log("👉 클릭된 이메일:", email);
    // ✅ URL 노출 없이 상태로 전달
    navigate("/memberView", { state: { email } });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  return (
    <div className="member-list-container">
      <h2>회원 목록</h2>
      <ul>
        {memberList.map(vo => (
          <li
            key={vo.email}
            className="member-item"
            onClick={() => submit(vo.email)}
          >
            {vo.name} ({vo.email} / {vo.birth?.slice(0, 10)})
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)} className="back-button">
        🔙 이전으로
      </button>
    </div>
  );
}

export default MemberList;
