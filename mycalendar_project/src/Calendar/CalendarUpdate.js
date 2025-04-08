import React, { useState, useEffect } from 'react';
import axios from 'axios';

const toDatetimeLocal = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};

const CalendarUpdate = ({ id, onClose, onUpdate }) => {
  const [vo, setVo] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/calendar/calendarView.do?id=${id}`,{
        withCredentials: true
    })
      .then((res) => {
        const data = res.data;

        console.log("✅ 받은 color 값:", data.color); // 👈 여기 확인!

        setVo({
          id: id,
          title: data.title,
          content: data.content,
          start_date: toDatetimeLocal(data.start_date),
          end_date: toDatetimeLocal(data.end_date),
          all_Day: data.all_Day || 'N',
          color: data.color ?? '#3788d8'  // ✅ null 방어
        });
      })
      .catch(err => {
        console.error('일정 불러오기 실패:', err);
        alert('일정을 불러오지 못했습니다.');
        onClose();
      });
  }, [id, onClose]);

  if (!vo) return null; // 데이터 로딩 중엔 표시 안함

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setVo({ ...vo, [name]: checked ? 'Y' : 'N' });
    } else {
      setVo({ ...vo, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (!vo.title || vo.title.trim() === "") {
      alert("제목은 필수 입력 항목입니다.");
      return;
    }
  
    console.log("전송할 데이터 확인:", vo);
  
    axios.post(`http://localhost:8080/api/calendar/calendarUpdate.do?id=${id}`, vo, {
      withCredentials: true
    })
      .then(() => {
        alert('일정이 수정되었습니다.');
        onUpdate();
      })
      .catch(err => {
        console.error('수정 실패:', err);
        alert('일정 수정에 실패했습니다.');
      });
  };

  return (
    <div style={{
      position: 'fixed', top: '30%', left: '30%', background: 'white',
      padding: '20px', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999
    }}>
      <h3>일정 수정</h3>
      <input name="title" placeholder="제목" value={vo.title} onChange={handleChange} /><br />
      <textarea name="content" placeholder="내용" value={vo.content} onChange={handleChange} /><br />
      <input type="datetime-local" name="start_date" value={vo.start_date} onChange={handleChange} /> ~
      <input type="datetime-local" name="end_date" value={vo.end_date} onChange={handleChange} /><br />
      <label>
        하루 종일 
        <input
          type="checkbox"
          name="all_Day"
          checked={vo.all_Day === 'Y'}
          onChange={handleChange}
        />
      </label><br />
      <label>
        색상 선택 
        <input type="color" name="color" value={vo.color} onChange={handleChange} />
      </label><br /><br />

      <button onClick={handleSubmit}>수정</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default CalendarUpdate;
