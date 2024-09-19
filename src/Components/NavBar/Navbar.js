import React from "react";
import { useLocation } from "react-router-dom";
import { Nav, Ul, HRLight } from "./NavbarComponents";
import { NavItem } from "./NavItem/NavItem";
import { NavTitle } from "./NavTitle/NavTitle";
import { NavFooter } from "./NavFooter/NavFooter";

// NavBar Component
function NavBar() {
    const { pathname } = useLocation();

    // Nav menu items configuration
    const menuItems = [
        { path: "/", label: "홈", iconSrc: require("../../Assets/img/HomeIcon.png"), exact: true },
        { path: "/Check", label: "출결 관리", iconSrc: require("../../Assets/img/CheckIcon.png") },
        { path: "/Schedule", label: "일정 관리", iconSrc: require("../../Assets/img/CalendarIcon.png") },
        { path: "/Score", label: "점수 관리", iconSrc: require("../../Assets/img/ScoreIcon.png") },
        { path: "/User", label: "사용자 관리", iconSrc: require("../../Assets/img/NavBar_MemberIcon.png") },
    ];

    return (
        <Nav>
            <Ul>
                {/* Logo and Title */}
                <NavTitle/>
                <HRLight />

                {/* Menu Items */}
                {menuItems.map((item) => (
                    <NavItem
                        key={item.path}         // map의 key값
                        path={item.path}        // 이동할 페이지 항목
                        pathname={pathname}     // 현재 URL 경로
                        iconSrc={item.iconSrc}  // 아이콘의 이미지 경로
                        label={item.label}      // 이동할 페이지의 label
                        exact={item.exact}      // true이면 경로가 정확히 일치할 때, false이면 경로가 시작되는 부분만 일치해도 
                    />
                ))}

                {/* Notion Link */}
                <NavFooter/>
            </Ul>
        </Nav>
    );
}

export default NavBar;




