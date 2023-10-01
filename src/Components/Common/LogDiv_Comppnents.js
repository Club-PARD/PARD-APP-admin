import styled from "styled-components";
import { auth } from "../../fbase";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;
  margin-right: 64px;
  /* background-color: red; */
`;

const NameText = styled.div`
  color: var(--black-background, #1A1A1A);
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;

const LogText = styled.div`
  color: var(--black-background, #1A1A1A);
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;
`;

const BarText = styled.div`
  width: 2px;
  height: 24px;
  margin-top: 1px;
  margin-left: 12px;
  margin-right: 14px;
  background: linear-gradient(92deg, #5262f5 0%, #7b3fef 100%);
`;


const CommonLogSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase 로그아웃 실행
      alert("로그아웃되었습니다.");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/Login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <LogDiv>
      <NameText>{localStorage.getItem("userName")}</NameText>
      <BarText />
      <LogText onClick={handleLogout}>로그아웃</LogText>
    </LogDiv>
  );
};

export default CommonLogSection;
