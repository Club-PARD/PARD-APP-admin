import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Components/NavBar/Navbar";
import CheckPage from "./Page/CheckPage";
import HomePage from "./Page/HomePage";
import LoginPage from "./Page/LoginPage";
import MasterPage from "./Page/MasterPage";
import MemberPage from "./Page/MemberPage";
import SchedulePage from "./Page/SchedulePage";
import ScorePage from "./Page/ScorePage";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const NavBarContainer = styled.div`
  width: 15vw;
  min-width: 250px;
  background-color: rgba(30, 30, 44, 1);
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #FFF;
  /* padding: 20px; */
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Score" element={<ScorePage />} />
            <Route path="/Check" element={<CheckPage />} />
            <Route path="/Schedule" element={<SchedulePage />} />
            <Route path="/Member" element={<MemberPage />} />
            <Route path="/Master" element={<MasterPage />} />
            <Route path="/Login" element={<LoginPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
