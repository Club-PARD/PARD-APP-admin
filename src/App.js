import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Components/NavBar/Navbar";
import CheckPage from "./Page/CheckPage";
import HomePage from "./Page/HomePage";
import LoginPage from "./Page/LoginPage";
import MemberPage from "./Page/MemberPage";
import SchedulePage from "./Page/SchedulePage";
import ScorePage from "./Page/ScorePage";

/* 
- 개발자 도구 Console 메세지 강제 제거
- 토큰 조회
- Route 코드
*/

function App() {
  // 개발자 도구 Console 메세지 강제 제거
  // if (1 + 1 === 2) {
  //   window.console = {
  //     log: function () {},
  //     warn: function () {},
  //     error: function () {},
  //   };
  // }

  // 토큰 조회
  const token = localStorage.getItem("token");

  // Route 코드
  return (
    <Router>
      <AppContainer>
        {token === "pardo-admin-key" ? (
          <NavBarContainer>
            <NavBar />
          </NavBarContainer>
        ) : (
          <></>
        )}
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Score" element={<ScorePage />} />
            <Route path="/Check" element={<CheckPage />} />
            <Route path="/Schedule" element={<SchedulePage />} />
            <Route path="/Member" element={<MemberPage />} />
            <Route path="/Login" element={<LoginPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const NavBarContainer = styled.div`
  width: 15vw;
  min-width: 250px;
  background: var(--black-card, #2a2a2a);
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #fff;
`;
