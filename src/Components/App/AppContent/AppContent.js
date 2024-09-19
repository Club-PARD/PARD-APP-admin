import { Route, Routes, useLocation } from "react-router-dom";
import { AppContainer, MainContent, NavBarContainer } from "./AppContentComponents";

import AttendancePage from "../../../Page/AttendancePage";
import HomePage from "../../../Page/HomePage";
import LoginPage from "../../../Page/LoginPage";
import UserPage from "../../../Page/UserPage";
import SchedulePage from "../../../Page/SchedulePage";
import ScorePage from "../../../Page/ScorePage";
import NavBar from "../../NavBar/Navbar";

export const AppContent = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    const isLoginPage = location.pathname === "/Login";

    return (
        <AppContainer>
            {
                !isLoginPage && token === "pardo-admin-key" && (
                    <NavBarContainer>
                        <NavBar/>
                    </NavBarContainer>
                )
            }

            <MainContent>
                <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/Score" element={<ScorePage />}/>
                    <Route path="/Check" element={<AttendancePage />}/>
                    <Route path="/Schedule" element={<SchedulePage />}/>
                    <Route path="/User" element={<UserPage />}/>
                    <Route path="/Login" element={<LoginPage />}/>
                </Routes>
            </MainContent>
        </AppContainer>
    );
};
