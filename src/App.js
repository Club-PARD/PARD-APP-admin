import {BrowserRouter as Router, Routes, Route, useLocation, useNavigate} from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Components/NavBar/Navbar";
import AttendancePage from "./Page/AttendancePage";
import HomePage from "./Page/HomePage";
import LoginPage from "./Page/LoginPage";
import UserPage from "./Page/UserPage";
import SchedulePage from "./Page/SchedulePage";
import ScorePage from "./Page/ScorePage";
import {useEffect} from "react";
import {setupAxiosInterceptors} from "./Api/LoginService";
import { RecoilRoot } from "recoil";

/*
- 개발자 도구 Console 메세지 강제 제거
- 토큰 조회
- Route 코드
*/

const InterceptorSetup = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setupAxiosInterceptors(navigate);
    }, [navigate]);

    return null;
};

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isLoginPage = location.pathname === "/Login";

  return (
    <AppContainer>
      {!isLoginPage && token === "pardo-admin-key" && (
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
      )}
      
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Score" element={<ScorePage />} />
          <Route path="/Check" element={<AttendancePage />} />
          <Route path="/Schedule" element={<SchedulePage />} />
          <Route path="/User" element={<UserPage />} />
          <Route path="/Login" element={<LoginPage />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

function App() {
  return (
    <RecoilRoot>
      <Router>
        <InterceptorSetup />
        <AppContent />
      </Router>
    </RecoilRoot>
  );
}
export default App;

const AppContainer = styled.div `
  display: flex;
  min-height: 100vh;
`;

const NavBarContainer = styled.div `
  min-width: 250px;
  background: var(--black-card, #2a2a2a);
`;

const MainContent = styled.div `
  background-color: #fff;
  width: calc(100% - 250px);
`;
