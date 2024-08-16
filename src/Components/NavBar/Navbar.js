import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

/*
- 현재 페이지의 URL 조회
- Main 화면 코드
*/

function NavBar() {
  // 현재 페이지의 URL 조회
  const { pathname } = useLocation();

  return (
    <Nav>
      <Ul>
        <li>
          <TitleDiv>
            <Logo src={require("../../Assets/img/Logo/Original.png")} />
            <TitleText>관리자 페이지</TitleText>
          </TitleDiv>
        </li>
        <HRLight />
        <li>
          <DisplayDiv>
            {/* <DisplayTextDiv bottom={0} active={pathname === "/"}> */}
                        <DisplayTextDiv $bottom={0} $active={pathname === "/" ? "true" : undefined}>
              {pathname === "/" ? (
                <>
                  <Icon
                    src={require("../../Assets/img/HomeIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/HomeIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              {/* <MenuLink to="/" active={pathname === "/as"}> */}
            <MenuLink to="/" $active={pathname === "/" ? "true" : undefined}>
                홈
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            {/* <DisplayTextDiv bottom={0} active={pathname.startsWith("/Check")}> */}
            <DisplayTextDiv $bottom={0} $active={pathname.startsWith("/Check") ? "true" : undefined}>
              {pathname.startsWith("/Check") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/CheckIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/CheckIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              {/* <MenuLink to="/Check" active={pathname.startsWith("/asd")}> */}
              <MenuLink to="/Check" $active={pathname.startsWith("/Check") ? "true" : undefined}>
                출결 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            {/* <DisplayTextDiv bottom={0} active={pathname.startsWith("/Schedule")}> */}
            <DisplayTextDiv $bottom={0} $active={pathname.startsWith("/Schedule") ? "true" : undefined}>
              {pathname.startsWith("/re") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/CalendarIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/CalendarIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              {/* <MenuLink to="/Schedule" active={pathname.startsWith("/Scheduasdle")}> */}
              <MenuLink to="/Schedule" $active={pathname.startsWith("/Schedule") ? "true" : undefined}>
                일정 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            {/* <DisplayTextDiv bottom={0} active={pathname.startsWith("/Score")}> */}
            <DisplayTextDiv $bottom={0} $active={pathname.startsWith("/Score") ? "true" : undefined}>
              {pathname.startsWith("/shopManager") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/ScoreIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/ScoreIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              {/* <MenuLink to="/Score" active={pathname.startsWith("/shopManager")}> */}
              <MenuLink to="/Score" $active={pathname.startsWith("/Score") ? "true" : undefined}>
                점수 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            {/* <DisplayTextDiv bottom={0} active={pathname.startsWith("/Member")}> */}
            <DisplayTextDiv $bottom={0} $active={pathname.startsWith("/Member") ? "true" : undefined}>
              {pathname.startsWith("/Member") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/NavBar_MemberIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/NavBar_MemberIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              {/* <MenuLink to="/Member" active={pathname.startsWith("/ㅁㄴㅇ")}> */}
              <MenuLink to="/Member" $active={pathname.startsWith("/Member") ? "true" : undefined}>
                사용자 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            <DisplayTextDiv
              onClick={() => {
                window.open(
                  "https://www.notion.so/we-pard/Pay-it-Forward-IT-ac8ea82c7313469ead747a89a5c9d3cb?pvs=4",
                  "_blank"
                );
              }}
              style={{ cursor: "pointer" }}
            >
              {pathname.startsWith("/setting") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/NotionIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/NotionIcon.png")}
                    width={24}
                    height={24}
                    $right={14}
                  />
                </>
              )}
              <MenuLink>공식 노션 바로가기</MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
      </Ul>
    </Nav>
  );
}

export default NavBar;

const Nav = styled.nav`
  flex: 1;
  background: var(--black-card, #2a2a2a);
  color: white;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  justify-content: flex-start;
  min-width: 200px;
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  display: flex;
  width: 115px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-right: 8px;
`;

const TitleText = styled.div`
  color: var(--White, #fff);
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-top: 3px;
`;

const HRLight = styled.hr`
  width: 91%;
  margin-top: 27px;
  border: 0.5px dotted #d9d9d9;
  background-color: #d9d9d9;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 3px;
`;

const DisplayDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
`;

const DisplayTextDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.$bottom}px;
  width: 100%;
  height: 58px;
  padding-left: 23px;

  &:hover {
    background: #323553;
  }
  background: ${(props) =>
    props.$active
      ? "var(--grabp, linear-gradient(92deg, #5262F5 0%, #7B3FEF 100%))"
      : "transparent"};
`;

const Icon = styled.img`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin-right: ${(props) => props.$right}px;
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  margin-top: 5px;
  color: var(--White, #fff);
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  &:hover {
    background: #323553;
  }
  background: ${(props) =>
    props.$active
      ? "var(--grabp, linear-gradient(92deg, #5262F5 0%, #7B3FEF 100%))"
      : "transparent"};
`;
