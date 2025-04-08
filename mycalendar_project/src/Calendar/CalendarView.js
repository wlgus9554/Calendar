import React from 'react';
import dayjs from 'dayjs';

const CalendarView = ({ event, onClose, onUpdate, onDelete }) => {
  return (
    <div style={{
      position: 'fixed', top: '30%', left: '30%', background: 'white',
      padding: '20px', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999
    }}>
      <h3>일정 상세 보기</h3>
      <p><strong>제목:</strong> {event.title}</p>
      <p><strong>내용:</strong> {event.content}</p>
      <p><strong>시작:</strong> {dayjs(event.start_date).format('YYYY-MM-DD HH:mm')}</p>
      <p><strong>종료:</strong> {dayjs(event.end_date).format('YYYY-MM-DD HH:mm')}</p>
      <p>
        <strong>하루 종일:</strong>
        <input type="checkbox" readOnly checked={event.all_Day === 'Y'} style={{ marginLeft: '8px' }} />
      </p>
      <br />
      <button onClick={onUpdate} style={{ marginRight: '10px' }}>수정</button>
      <button onClick={onDelete} style={{ marginRight: '10px' }}>삭제</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default CalendarView;
