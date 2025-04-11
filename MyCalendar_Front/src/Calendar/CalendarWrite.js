import React, { useState } from 'react';
import './CalendarWrite.css';

const toDatetimeLocal = (dateObj) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  const localDate = new Date(dateObj.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

const CalendarWrite = ({ date, onClose, onSave }) => {
  // 현재 시각
  const now = new Date();

  // ① 사용자가 날짜를 클릭했을 경우: 해당 날짜 + 현재 시간으로 보정
  let baseDate;
  if (date) {
    const clickedDate = new Date(date); // 예: 2025-04-11
    clickedDate.setHours(now.getHours(), now.getMinutes(), 0, 0); // 현재 시각 적용
    baseDate = clickedDate;
  } else {
    baseDate = now;
  }

  const oneHourLater = new Date(baseDate.getTime() + 60 * 60 * 1000); // +1시간

  const [vo, setVo] = useState({
    title: '',
    content: '',
    start_date: toDatetimeLocal(baseDate),
    end_date: toDatetimeLocal(oneHourLater),
    all_Day: 'N',
    color: '#3788d8'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setVo({ ...vo, [name]: checked ? 'Y' : 'N' });
    } else {
      setVo({ ...vo, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSave(vo);
  };

  return (
    <div className="calendar-write-modal">
      <h3>일정 등록</h3>
      <input name="title" placeholder="제목" value={vo.title} onChange={handleChange} />
      <textarea name="content" placeholder="내용" value={vo.content} onChange={handleChange} />
      <input type="datetime-local" name="start_date" value={vo.start_date} onChange={handleChange} />
      <input type="datetime-local" name="end_date" value={vo.end_date} min={vo.start_date} onChange={handleChange} />

      <div className="checkbox-row">
        <input
          type="checkbox"
          name="all_Day"
          checked={vo.all_Day === 'Y'}
          onChange={handleChange}
        />
        <label htmlFor="all_Day">하루 종일</label>
      </div>

      <label>색상 선택</label>
      <input type="color" name="color" value={vo.color} onChange={handleChange} />

      <div className="button-row">
        <button onClick={handleSubmit}>등록</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default CalendarWrite;
