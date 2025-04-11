import React from 'react';
import dayjs from 'dayjs';
import './CalendarView.css'; // 👉 CSS 분리해서 사용할 경우

const CalendarView = ({ event, onClose, onUpdate, onDelete }) => {
  return (
    <div className="calendar-view-modal">
      <h3>📌 일정 상세 보기</h3>
      
      <div className="calendar-view-field">
        <strong>제목:</strong> {event.title}
      </div>
      <div className="calendar-view-field">
        <strong>내용:</strong> {event.content}
      </div>
      <div className="calendar-view-field">
        <strong>시작:</strong> {dayjs(event.start_date).format('YYYY-MM-DD HH:mm')}
      </div>
      <div className="calendar-view-field">
        <strong>종료:</strong> {dayjs(event.end_date).format('YYYY-MM-DD HH:mm')}
      </div>
      <div className="calendar-view-field">
        <strong>하루 종일:</strong>
        <input type="checkbox" readOnly checked={event.all_Day === 'Y'} style={{ marginLeft: '8px' }} />
      </div>

      <div className="calendar-view-buttons">
        <button className="update" onClick={onUpdate}>✏ 수정</button>
        <button className="delete" onClick={onDelete}>🗑 삭제</button>
        <button className="close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CalendarView;
