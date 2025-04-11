import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CalendarView from './CalendarView';
import CalendarWrite from './CalendarWrite';
import CalendarUpdate from './CalendarUpdate';
import CalendarDelete from './CalendarDelete';
import WeatherPanel from './WeatherPanel';

import '../App.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showWrite, setShowWrite] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const loggedInEmail = sessionStorage.getItem("email"); // ✅ 사용자 이메일 확인
  console.log("📩 Calendar.js - loggedInEmail:", loggedInEmail); // ✅ 로그 추가

  const loadEvents = () => {
    fetch("http://localhost:8080/api/calendar/calendarList.do", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : Promise.reject("일정 불러오기 실패"))
      .then(data => {
        const mapped = data.map(vo => ({
          id: vo.id,
          title: vo.title,
          start: vo.start_date,
          end: vo.end_date,
          color: vo.color
        }));
        setEvents(mapped);
      })
      .catch(err => alert(err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventClick = (info) => {
    const id = info.event.id;
    fetch(`http://localhost:8080/api/calendar/calendarView.do?id=${id}`, {
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : Promise.reject("상세 조회 실패"))
      .then(vo => {
        setSelectedEvent(vo);
        setShowModal(true);
        setSelectedId(vo.id);
      })
      .catch(err => alert(err));
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowWrite(true);
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const response = await axios.post('http://localhost:8080/api/calendar/calendarWrite.do', newEvent, {
        withCredentials: true
      });
  
      const savedEvent = response.data;
  
      if (!savedEvent.id) {
        alert("등록은 성공했지만 id를 받을 수 없습니다.");
        return;
      }
  
      // 달력에 추가 (옵션)
      const calendarEvent = {
        id: savedEvent.id,
        title: savedEvent.title,
        start: savedEvent.start_date,
        end: savedEvent.end_date,
        allDay: savedEvent.all_day === 'Y',
        color: savedEvent.color
      };
  
      setEvents([...events, calendarEvent]);
      setShowWrite(false);
  
      // ✅ 등록 후 바로 상세조회 열기
      const detailRes = await axios.get(`http://localhost:8080/api/calendar/calendarView.do?id=${savedEvent.id}`, {
        withCredentials: true
      });
  
      setSelectedEvent(detailRes.data);
      setSelectedId(savedEvent.id);
      setShowModal(true);
  
    } catch (error) {
      console.error("일정 등록 실패", error);
      alert("등록 실패");
    }
  };
  

  const handleOpenUpdate = () => {
    setUpdateOpen(true);
    setShowModal(false);
  };

  const handleOpenDelete = () => {
    setDeleteOpen(true);
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 좌측: FullCalendar */}
      <div style={{ flex: 1 }}>
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            locale={'ko'}
            titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
          />

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🏠 메인으로
            </button>
          </div>
        </div>

        {/* 모달 영역 */}
        {showModal && selectedEvent && (
          <CalendarView
            event={selectedEvent}
            onClose={() => setShowModal(false)}
            onUpdate={handleOpenUpdate}
            onDelete={handleOpenDelete}
          />
        )}

        {showWrite && (
          <CalendarWrite
            date={selectedDate}
            onClose={() => setShowWrite(false)}
            onSave={handleAddEvent}
          />
        )}

        {updateOpen && (
          <CalendarUpdate
            id={selectedId}
            onClose={() => setUpdateOpen(false)}
            onUpdate={() => {
              loadEvents();
              setUpdateOpen(false);
            }}
          />
        )}

        {deleteOpen && (
          <CalendarDelete
            id={selectedId}
            onClose={() => setDeleteOpen(false)}
            onDelete={() => {
              loadEvents();
              setDeleteOpen(false);
            }}
          />
        )}
      </div>

      {loggedInEmail && (
        <div style={{ width: '280px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <WeatherPanel email={loggedInEmail} />
        </div>
      )}
    </div>
  );
};

export default Calendar;
