import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CalendarDelete = ({ id, onClose, onDelete }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/calendar/calendarView.do?id=${id}`, {
      withCredentials: true
    })
      .then(res => {
        setTitle(res.data.title || '');
      })
      .catch(err => {
        console.error('일정 정보 불러오기 실패:', err);
        alert('일정 정보를 불러오지 못했습니다.');
        onClose();
      });
  }, [id, onClose]);

  const handleDelete = () => {
    axios.post(`http://localhost:8080/api/calendar/calendarDelete.do?id=${id}`, {
      withCredentials: true
    })
      .then(() => {
        alert('일정이 삭제되었습니다.');
        onDelete(); // 부모에게 알림
      })
      .catch(err => {
        console.error('삭제 실패:', err);
        alert('일정 삭제에 실패했습니다.');
      });
  };

  return (
    <div style={{
      position: 'fixed', top: '30%', left: '30%', background: 'white',
      padding: '20px', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999
    }}>
      <h3>일정 삭제</h3>
      <p>일정 제목: <strong>{title}</strong></p>
      <p>이 일정을 정말로 삭제하시겠습니까?</p>
      <button onClick={handleDelete} style={{ marginRight: '10px' }}>삭제</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default CalendarDelete;
