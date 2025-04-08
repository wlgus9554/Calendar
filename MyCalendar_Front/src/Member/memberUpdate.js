import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ navigate 사용

function MemberUpdate() {
  const [vo, setVo] = useState({
    email: '',
    name: '',
    nickName: '',
    birth: '',
    gender: '',
    tel: '',
    city: '',
    image: '',
    grade: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate(); // ✅ 히스토리 뒤로가기용

  // ✅ 로그인한 사용자의 정보(localStorage에서 꺼냄)
  const loginGrade = localStorage.getItem("loginGrade");
  const isAdmin = loginGrade === "admin";

  const email = new URLSearchParams(window.location.search).get("email");
  const password = new URLSearchParams(window.location.search).get("password");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/member/view.do?email=${email}&password=${password}`)
      .then(res => {
        const data = res.data;
        setVo({
          ...data,
          birth: data.birth?.slice(0, 10),
        });
        setImagePreview(data.image);
      });
  }, [email, password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("email", vo.email);
    formData.append("name", vo.name);
    formData.append("nickName", vo.nickName);
    formData.append("tel", vo.tel);
    formData.append("city", vo.city);
    formData.append("password", password); // WHERE 조건

    if (isAdmin) {
      formData.append("grade", vo.grade); // 관리자만 grade 수정 가능
      formData.append("status", vo.status);
    }

    formData.append("imageFile", imageFile || new Blob());

    try {
      await axios.post("http://localhost:8080/api/member/memberUpdate.do", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("회원 정보가 수정되었습니다.");
      window.location.href = `/view?email=${email}`;
    } catch (err) {
      alert("수정 실패!");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>회원 정보 수정</h2>

      <label>이메일 (읽기전용)</label><br />
      <input type="text" value={vo.email} disabled /><br />

      <label>이름</label><br />
      <input type="text" name="name" value={vo.name} onChange={handleChange} /><br />

      <label>닉네임</label><br />
      <input type="text" name="nickName" value={vo.nickName} onChange={handleChange} /><br />

      <label>전화번호</label><br />
      <input type="text" name="tel" value={vo.tel} onChange={handleChange} /><br />

      <label>지역</label><br />
      <select name="city" value={vo.city} onChange={handleChange}>
      <option value="">-- 지역을 선택하세요 --</option>
        <option value="서울">서울</option>
        <option value="경기도">경기도</option>
        <option value="인천">인천</option>
        <option value="강원도">강원도</option>
        <option value="충청북도">충청북도</option>
        <option value="충청남도">충청남도</option>
        <option value="경상북도">경상북도</option>
        <option value="경상남도">경상남도</option>
        <option value="전라북도">전라북도</option>
        <option value="전라남도">전라남도</option>
        <option value="부산">부산</option>
        <option value="제주도">제주도</option>
      </select><br />

      {isAdmin && (
        <>
          <label>등급 (관리자만 수정 가능)</label><br />
          <select name="grade" value={vo.grade} onChange={handleChange}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select><br />
          <label>상태 (관리자만 수정 가능)</label><br />
          <select name="status" value={vo.status} onChange={handleChange}>
            <option value="정상">정상</option>
            <option value="휴면">휴면</option>
            <option value="탈퇴">탈퇴</option>
          </select><br />
        </>
      )}

      <label>프로필 이미지</label><br />
      {imagePreview && <img src={imagePreview} alt="미리보기" width="120" />}<br />
      <input type="file" name="imageFile" onChange={handleFileChange} /><br /><br />

      <button onClick={handleSubmit}>수정 완료</button>
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

export default MemberUpdate;
