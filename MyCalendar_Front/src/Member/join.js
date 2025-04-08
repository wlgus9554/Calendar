// Join.js (회원가입 페이지) - 스타일 컴포넌트 적용 버전
import React, { useState } from 'react';
import axios from 'axios';
import './Join.css'; // 👈 스타일 분리


const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [tel, setTel] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("nickName", nickName);
    formData.append("birth", birth);
    formData.append("gender", gender);
    formData.append("tel", tel);
    formData.append("city", city);
    formData.append("imageFile", image || new Blob([], { type: 'image/png' }), "empty.png");

    try {
      await axios.post("http://localhost:8080/api/member/join.do", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("회원가입이 완료되었습니다!");
      window.location.href = "/api/member/memberList.do";
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="join-container">
      <h2>회원가입</h2>
      <div className="form-group">
        <label>아이디</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label>이름</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>닉네임</label>
        <input type="text" value={nickName} onChange={(e) => setNickName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>생년월일</label>
        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
      </div>
      <div className="form-group">
        <label>성별</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="gender" value="남자" checked={gender === '남자'} onChange={(e) => setGender(e.target.value)} />
            남자
          </label>
          <label>
            <input type="radio" name="gender" value="여자" checked={gender === '여자'} onChange={(e) => setGender(e.target.value)} />
            여자
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>전화번호</label>
        <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} />
      </div>
      <div className="form-group">
        <label>지역</label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
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
        </select>
      </div>
      <div className="form-group">
        <label>사진</label>
        <input type="file" name="imageFile" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>가입하기</button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default Join;
