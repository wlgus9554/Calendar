import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './memberUpdate.css'; // 스타일 분리

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
    status: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const loginGrade = localStorage.getItem("loginGrade");
  const isAdmin = loginGrade === "admin";

  // ✅ 전달받은 state에서 email, password 추출
  const { email, password } = location.state || {};

  useEffect(() => {
    if (!email || (!isAdmin && !password)) {
      alert("잘못된 접근입니다.");
      return navigate("/");
    }    

    axios.get(`http://localhost:8080/api/member/view.do?email=${email}&password=${password}`)
      .then(res => {
        const data = res.data;
        setVo({
          ...data,
          birth: data.birth?.slice(0, 10),
        });
        setImagePreview(data.image);
      });
  }, [email, password, navigate]);

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
  
    // ✅ 관리자 아니면 password도 포함
    if (!isAdmin) {
      formData.append("password", password);
    }
  
    if (isAdmin) {
      formData.append("grade", vo.grade);
      formData.append("status", vo.status);
    }
  
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else {
      formData.append("image", vo.image);
    }
  
    try {
      await axios.post("http://localhost:8080/api/member/memberUpdate.do", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true  // ✅ 세션 쿠키 유지 (중요!)
      });
      alert("회원 정보가 수정되었습니다.");
      navigate('/memberView', { state: { email } });
    } catch (err) {
      alert("수정 실패!");
      console.error(err);
    }
  };
  

  return (
    <div className="update-container">
      <h2>회원 정보 수정</h2>

      <div className="form-group">
        <label>이메일 (읽기전용)</label>
        <input type="text" value={vo.email} disabled />
      </div>

      <div className="form-group">
        <label>이름</label>
        <input type="text" name="name" value={vo.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>닉네임</label>
        <input type="text" name="nickName" value={vo.nickName} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>전화번호</label>
        <input type="text" name="tel" value={vo.tel} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>지역</label>
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
        </select>
      </div>

      {isAdmin && (
        <>
          <div className="form-group">
            <label>등급</label>
            <select name="grade" value={vo.grade} onChange={handleChange}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>상태</label>
            <select name="status" value={vo.status} onChange={handleChange}>
              <option value="정상">정상</option>
              <option value="휴면">휴면</option>
              <option value="탈퇴">탈퇴</option>
            </select>
          </div>
        </>
      )}

      <div className="form-group">
        <label>프로필 이미지</label>
        {imagePreview && <img src={imagePreview} alt="미리보기" className="image-preview" />}
        <input type="file" name="imageFile" onChange={handleFileChange} />
      </div>

      <div className="button-group">
        <button className="submit-btn" onClick={handleSubmit}>수정 완료</button>
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 이전으로</button>
      </div>
    </div>
  );
}

export default MemberUpdate;
