import React from 'react';


const MainPage = () => {
  const user = JSON.parse(sessionStorage.getItem("loginUser"));

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>📅 My Calendar</h1>
      
      {user ? (
        <div>
          <p><strong>{user.nickName}</strong>님, 환영합니다!</p>
          <p>내 일정을 기록하고 공유해보세요!</p>
        </div>
      ) : (
        <div>
          <p>로그인 후 나만의 일정을 시작해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default MainPage;
