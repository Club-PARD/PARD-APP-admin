import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./Components/NavBar/Navbar";




const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const NavBarContainer = styled.div`
  width: 15vw;
  background-color: rgba(30, 30, 44, 1);
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #f6f6f6;
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
        
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
