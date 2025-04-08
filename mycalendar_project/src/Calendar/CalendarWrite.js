import React, { useState } from 'react';

const toDatetimeLocal = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  };

const CalendarWrite = ({ date, onClose, onSave }) => {
  const [vo, setVo] = useState({
    title: '',
    content: '',
    start_date: toDatetimeLocal(date),
    end_date: toDatetimeLocal(date),
    all_Day: 'N',
    color: '#3788d8'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 체크박스는 Y/N으로 처리
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
    <div style={{
      position: 'fixed', top: '30%', left: '30%', background: 'white',
      padding: '20px', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999
    }}>
      <h3>일정 등록</h3>
      <input name="title" placeholder="제목" value={vo.title} onChange={handleChange} /><br />
      <textarea name="content" placeholder="내용" value={vo.content} onChange={handleChange} /><br />
      <input type="datetime-local" name="start_date" value={vo.start_date} onChange={handleChange} /> ~
      <input type="datetime-local" name="end_date" value={vo.end_date} onChange={handleChange} /><br />
      <label>
        하루 종일 
        <input
          type="checkbox"
          name="all_Day"
          checked={vo.all_Day === 'Y'} // Y일 때만 체크됨
          onChange={handleChange}
        />
      </label><br />
      <label>
        색상 선택 
        <input type="color" name="color" value={vo.color} onChange={handleChange} />
      </label><br /><br />

      <button onClick={handleSubmit}>등록</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default CalendarWrite;
