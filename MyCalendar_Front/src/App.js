// App.js 또는 App.jsx에 들어갈 코드입니다!
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Login from './Member/login';
import Join from './Member/join';
import MemberList from './Member/memberList';
import MemberView from './Member/memberView';
import MemberUpdate from './Member/memberUpdate';
import MyCalendar from './Calendar/calendarList';
import Layout from './Components/Layout';
import PrivateRoute from "./Components/PrivateRoute";
import RequireAdmin from './Components/RequireAdmin';

function App() {
  return (
    <BrowserRouter>
    {/* Routes의 시작*/}
      <Routes>
        <Route path="/" element={
          <Layout>
            <MainPage />
          </Layout>
            }/>
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
          } />
        <Route path="/join" element={
          <Layout>
            <Join />
          </Layout>
          } />
        <Route path="/memberList" element={
          <RequireAdmin>
            <Layout>
              <MemberList/>
            </Layout>
          </RequireAdmin>
          } />
        <Route path="/memberView" element={
          <Layout>
            <MemberView />
          </Layout>
          } /> 
        <Route path="/memberUpdate" element={
          <Layout>
            <MemberUpdate />
          </Layout>
          } />
        <Route path='/calendar' element={
           <PrivateRoute>
            <Layout>
              <MyCalendar/>
            </Layout>
           </PrivateRoute>
          } />
        {/* 필요한 페이지를 계속 추가 가능 */}
      </Routes>
      {/* Routes의 끝*/}
    </BrowserRouter>
  );
}

export default App;
