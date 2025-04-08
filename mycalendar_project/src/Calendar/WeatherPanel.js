import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const WeatherPanel = ({ email }) => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/weather/weekly?email=${email}`)
      .then(res => {
        const shortList = res.data.shortTerm || [];
        const midList = res.data.midTerm || [];

        const merged = {};
        const preferredTimes = ["0900", "0600", "1200", "0000"];
        const today = dayjs();
        const startOfWeek = today.startOf('week').add(1, 'day');

        const weekDates = Array.from({ length: 7 }).map((_, i) =>
          startOfWeek.add(i, 'day').format('YYYY-MM-DD')
        );

        weekDates.forEach(date => {
          preferredTimes.some(time => {
            const match = shortList.find(s => s.date === date && s.time === time);
            if (match) {
              if (!merged[date]) merged[date] = { date };
              merged[date].sky = match.sky;
              return true;
            }
            return false;
          });

          const mid = midList.find(m => m.date === date);
          if (mid && mid.weather) {
            if (!merged[date]) merged[date] = { date };
            merged[date].midWeather = mid.weather;
          }
        });

        const result = weekDates.map(date => ({
          date,
          ...merged[date],
        }));

        setMergedData(result);
      })
      .catch(err => {
        console.error("날씨 데이터 오류:", err);
      });
  }, [email]);

  const getSkyEmoji = (code) => {
    switch (code) {
      case "1": return "☀️";
      case "3": return "⛅";
      case "4": return "☁️";
      default: return null;
    }
  };

  const getMidWeatherEmoji = (text) => {
    if (!text) return "☁️";
    if (text.includes("맑")) return "☀️";
    if (text.includes("구름")) return "⛅";
    if (text.includes("흐")) return "☁️";
    if (text.includes("비")) return "🌧️";
    if (text.includes("눈")) return "❄️";
    return "📝";
  };

  const getBackgroundColor = (skyCode, midWeather) => {
    const text = midWeather || '';
    const code = skyCode || '';

    if (code === "1" || text.includes("맑")) return '#fffbe6';   // 연노랑
    if (code === "4" || text.includes("흐")) return '#f5f5f5';   // 흐림
    if (text.includes("비")) return '#e6f7ff';                  // 비
    if (text.includes("눈")) return '#f0f5ff';                  // 눈
    return '#ffffff'; // 기본
  };

  const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', padding: '1rem', borderLeft: '2px solid #ddd' }}>
      <h3 style={{ marginBottom: '1.2rem' }}>📅 <strong>일주일간의 날씨</strong></h3>

      {mergedData.map((item, idx) => {
        const weekday = getWeekday(item.date);
        const emoji = item.sky ? getSkyEmoji(item.sky) : getMidWeatherEmoji(item.midWeather);
        const label = item.sky
        ? getSkyText(item.sky)
        : item.midWeather || '날씨 정보 없음';


        return (
          <div
            key={idx}
            style={{
              backgroundColor: getBackgroundColor(item.sky, item.midWeather),
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '0.8rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
              {item.date} ({weekday})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
              <span style={{ color: '#333' }}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 날씨 설명 텍스트
const getSkyText = (code) => {
  switch (code) {
    case "1": return "맑음";
    case "3": return "구름 많음";
    case "4": return "흐림";
    default: return "알 수 없음";
  }
};

export default WeatherPanel;
