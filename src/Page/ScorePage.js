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
  margin-top: 36px;
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
  color: var(--black-background, #1a1a1a);
  /* Admin/A1-M-18 */
  font-family: "Pretendard";
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
  background: linear-gradient(92deg, #5262f5 0%, #7b3fef 100%);
`;

const ScorePage = () => {
  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>점수 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 파드너십을 관리해보세요.</SubTitle>
      </TitleDiv>
    </DDiv>
  );
};

export default ScorePage;
