import React from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";

const DDiv = styled.div`
  background: #f6f6f6;
  margin: 0 auto;
  height: 100%;
  /* background-color: red; */
  overflow-y: hidden;
`;

const TitleDiv = styled.div`
  display: flex;
  margin-top: 53px;
  margin-left: 80px;
  align-items: center;
`;

const HomeTitle = styled.div`
  color: var(--black-background, #1a1a1a);
  /* Admin/A2-B-24 */
  font-family: "Pretendard";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const SubTitle = styled.div`
color: var(--black-background, #1A1A1A);
/* Admin/A1-M-18 */
font-family: 'Pretendard';
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 24px; 
margin-top: 1px;
`;

const BarText = styled.div`
  width: 2px;
height: 24px;
margin-top: 1px;
margin-left: 12px;
margin-right: 14px;
background: linear-gradient(92deg, #5262F5 0%, #7B3FEF 100%);
`;

const AlertText = styled.div`
color: var(--Gray30, #A3A3A3);
/* Body/B5-M-14 */
font-family: 'Pretendard';
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: 18px;
margin-left: 8px;
`

const SchedulePage = () => {
  return (
    <DDiv>
             <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>일정 관리</HomeTitle>
        <BarText/>
        <SubTitle>중요한 일정을 공지하고 알림을 발송하세요.</SubTitle>
        <AlertText>* 일정 전날 오후 9시에 알림이 발송됩니다.</AlertText>
      </TitleDiv>
    </DDiv>
  );
};

export default SchedulePage;
