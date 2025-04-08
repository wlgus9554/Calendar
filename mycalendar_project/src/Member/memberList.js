import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

function MemberList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ✅ 초기화

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
    navigate(`/view?email=${encodeURIComponent(email)}`); // ✅ 페이지 이동!
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  return (
    <div>
      <h2>회원 목록</h2>
      <ul>
        {list.map(vo => (
          <li key={vo.email} onClick={() => submit(vo.email)}>
            {vo.name} ({vo.email}/{vo.birth?.slice(0, 10)})
          </li>
        ))}
      </ul>
      {/* 🔙 이전으로 버튼 */}
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
  );
}

export default MemberList;
