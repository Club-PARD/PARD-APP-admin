import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  flex: 1;
  background-color: rgba(30, 30, 44, 1);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
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
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-top: 7px;
`;

const HRLight = styled.hr`
  width: 99.5%;
  margin-top: 27px;
  border: 1px dotted #d9d9d9;
  background-color: #d9d9d9;
  margin-bottom: 10px;
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
  margin-bottom: ${(props) => props.bottom}px;
`;

const Icon = styled.img`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin-right: ${(props) => props.right}px;
`;

const MenuItem = styled.li`
  display: block;
  font-family: "NotoSansKR";
  min-height: 30px;
  margin-top: 10px;
  height: auto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 5px;
  margin-top: ${(props) => props.top}px;
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  /* gap: 8px; */
  height: 48px;
  /* background-color: red; */
  font-family: "NotoSansKR";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${(props) => (props.active ? "#0079E0" : "#FFFFFF")};
`;

const CircleIcon = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#0079E0" : "#FFFFFF")};
  margin-right: 8px;
  margin-left: 40px;
`;

const UpArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: ${(props) => props.left}px;
`;

const DownArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: ${(props) => props.left}px;
`;

function NavBar() {
  const [isSubMemberOpen, setIsSubMemberOpen] = useState(false);
  const { pathname } = useLocation(); // 현재 페이지의 URL을 가져옴

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
            <DisplayTextDiv bottom={0}>
              {pathname === "/" ? (
                <>
                  <Icon
                    src={require("../../Assets/img/HomeIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/HomeIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              )}
              <MenuLink to="/" active={pathname === "/"}>
                홈
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            <DisplayTextDiv bottom={-5}>
              {pathname.startsWith("/notice") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/CheckIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/CheckIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              )}
              <MenuLink to="/Check" active={pathname.startsWith("/notice")}>
                출결 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            <DisplayTextDiv bottom={-5}>
              {pathname.startsWith("/re") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/CalendarIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/CalendarIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              )}
              <MenuLink to="/Schedule" active={pathname.startsWith("/re")}>
                일정 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <li>
          <DisplayDiv>
            <DisplayTextDiv bottom={-5}>
              {pathname.startsWith("/shopManager") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/ScoreIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/ScoreIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              )}
              <MenuLink
                to="/Score"
                active={pathname.startsWith("/shopManager")}
              >
                점수 관리
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
        <MenuItem isSubMemberOpen={isSubMemberOpen} top={15}>
          <DisplayDiv onClick={() => setIsSubMemberOpen(!isSubMemberOpen)}>
            <DisplayTextDiv>
              <Icon
                src={require("../../Assets/img/MemberIcon.png")}
                width={24}
                height={24}
                right={14}
              />
              <span
                onClick={() => setIsSubMemberOpen(!isSubMemberOpen)}
                style={{ cursor: "pointer" }}
              >
                회원{" "}
              </span>
            </DisplayTextDiv>
            {isSubMemberOpen ? (
              <UpArrowIcon src={require("../../Assets/img/UpArrow.png")} />
            ) : (
              <DownArrowIcon src={require("../../Assets/img/DownArrow.png")} />
            )}
          </DisplayDiv>
          {isSubMemberOpen && (
            <Ul>
              <li>
                <MenuLink
                  to="/Member"
                  active={pathname.startsWith("/Member")}
                >
                  <CircleIcon
                    active={pathname.startsWith("/Member")}
                  />
                  회원 관리
                </MenuLink>
              </li>
              <li>
                <MenuLink
                  to="/Master"
                  active={pathname.startsWith("/Master")}
                >
                  <CircleIcon
                    active={pathname.startsWith("/Master")}
                  />
                  관리자 권한
                </MenuLink>
              </li>
            </Ul>
          )}
        </MenuItem>
        <li>
          <DisplayDiv>
            <DisplayTextDiv>
              {pathname.startsWith("/setting") ? (
                <>
                  <Icon
                    src={require("../../Assets/img/NotionIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              ) : (
                <>
                  <Icon
                    src={require("../../Assets/img/NotionIcon.png")}
                    width={24}
                    height={24}
                    right={14}
                  />
                </>
              )}
              <MenuLink to="/setting" active={pathname.startsWith("/setting")}>
                공식 노션 바로가기
              </MenuLink>
            </DisplayTextDiv>
          </DisplayDiv>
        </li>
      </Ul>
    </Nav>
  );
}

export default NavBar;
