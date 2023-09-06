import React from "react";
import styled from "styled-components";

const LogDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;
  margin-right: 64px;
  background-color: red;
`;

const LogText = styled.div`
  color: var(--black-background, #1A1A1A);
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;

const BarText = styled.div`
  width: 2px;
  height: 24px;
  margin-top: 1px;
  margin-left: 12px;
  margin-right: 14px;
  background: linear-gradient(92deg, #5262f5 0%, #7b3fef 100%);
`;

const CommonLogSection = ({ username }) => {
  return (
    <LogDiv>
      <LogText>{username}</LogText>
      <BarText />
      <LogText>로그아웃</LogText>
    </LogDiv>
  );
};

export default CommonLogSection;
