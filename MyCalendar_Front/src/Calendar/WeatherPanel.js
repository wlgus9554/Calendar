import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const WeatherPanel = ({ email }) => {
  const [mergedData, setMergedData] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const fetchWeather = async (params) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/weather/weekly`, { params });

      const shortList = res.data.shortTerm || [];
      const midList = res.data.midTerm || [];

      const merged = {};
      const preferredTimes = ["0900", "0600", "1200", "0000"];
      const today = dayjs();
      const weekDates = Array.from({ length: 7 }).map((_, i) =>
        today.add(i, 'day').format('YYYY-MM-DD')
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
    } catch (err) {
      alert("날씨 정보를 불러오는 데 실패했습니다.");
      console.error(err);
    }
  };

  // ✅ 초기 로그인 사용자의 지역 날씨
  useEffect(() => {
    if (email) {
      fetchWeather({ email });
    }
  }, [email]);

  // ✅ 지역 목록 불러오기 (weather 테이블의 city만)
  useEffect(() => {
    axios.get("http://localhost:8080/api/weather/cities")
      .then(res => {
        setCityList(res.data);
      })
      .catch(err => {
        console.error("도시 목록 로딩 실패", err);
      });
  }, []);

  const handleSelectChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      fetchWeather({ city });
    }
  };

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
    if (code === "1" || text.includes("맑")) return '#fffbe6';
    if (code === "4" || text.includes("흐")) return '#f5f5f5';
    if (text.includes("비")) return '#e6f7ff';
    if (text.includes("눈")) return '#f0f5ff';
    return '#ffffff';
  };

  const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  };

  const getSkyText = (code) => {
    switch (code) {
      case "1": return "맑음";
      case "3": return "구름 많음";
      case "4": return "흐림";
      default: return "알 수 없음";
    }
  };

  return (
    <>
      {/* 드롭다운 UI */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedCity}
          onChange={handleSelectChange}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">📍 지역 선택</option>
          {cityList.map((city, i) => (
            <option key={i} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', padding: '1rem', borderLeft: '2px solid #ddd' }}>
      <h3 style={{ marginBottom: '1.2rem' }}>
        📅 <strong>{selectedCity || "내 지역"}의 일주일간 날씨</strong>
      </h3>


        {mergedData.map((item, idx) => {
          const weekday = getWeekday(item.date);
          const emoji = item.sky ? getSkyEmoji(item.sky) : getMidWeatherEmoji(item.midWeather);
          const label = item.sky ? getSkyText(item.sky) : item.midWeather || '날씨 정보 없음';

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
    </>
  );
};

export default WeatherPanel;
