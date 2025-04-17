import React, { useState } from 'react';
import axios from 'axios';
import './Join.css'; // 👈 스타일 분리
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { ko } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
registerLocale('ko', ko);

const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [birth, setBirth] = useState(""); // yyyy-MM-dd 형태
  const [gender, setGender] = useState("");
  const [tel, setTel] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setPasswordError(null);
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("nickName", nickName);
    formData.append("birth", birth);
    formData.append("gender", gender);
    formData.append("tel", tel);
    formData.append("city", city);
    if (image) {
      formData.append("imageFile", image);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/member/join.do`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("회원가입이 완료되었습니다!");
      window.location.href = "http://localhost:3000";
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  // 전화번호 자동 하이픈 삽입 함수
  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, '');

    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
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
        <label>비밀번호 확인</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {passwordError && <p className="error-msg">{passwordError}</p>}
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
        <ReactDatePicker
          selected={birth ? new Date(birth) : null}
          onChange={(date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            setBirth(`${yyyy}-${mm}-${dd}`);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="생년월일을 선택하세요"
          locale="ko"
          className="form-control"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()} // 👈 오늘까지만 선택 가능하게 설정
        />
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
        <input
          type="text"
          value={tel}
          onChange={(e) => setTel(formatPhoneNumber(e.target.value))}
          maxLength={13} // 010-1234-5678 최대 길이 제한
        />
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
