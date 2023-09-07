import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbService } from "../fbase";

const DDiv = styled.div`
  background: #f6f6f6;
  margin: 0 auto;
  height: 100%;
`;

const TitleDiv = styled.div`
  display: flex;
  margin-top: 36px;
  margin-left: 80px;
  align-items: center;
`;

const HomeTitle = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const SubTitle = styled.div`
  color: var(--black-background, #1a1a1a);
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

const BodyDiv = styled.div`
  display: flex;
  margin-top: 83px;
  margin-left: 80px;
  width: 1380px;
  height: 744px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;
`;

const TableHead = styled.thead`
  background-color: #eee;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  text-align: left;
`;

const ScorePage = () => {
  const [userScores, setUserScores] = useState([]);

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const userQuery = query(collection(dbService, "users"));
        const userSnapshot = await getDocs(userQuery);
    
        const scores = [];
    
        for (const userDoc of userSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
    
          // 사용자의 포인트 데이터 가져오기
          const pointQuery = query(collection(dbService, "points"), where("uid", "==", userId));
          const pointSnapshot = await getDocs(pointQuery);
    
          let mvpPoints = 0;
          let studyPoints = 0;
          let communicationPoints = 0;
          let retrospectionPoints = 0;
          let penaltyPoints = 0; // 벌점 포인트
    
          pointSnapshot.forEach((pointDoc) => {
            const pointData = pointDoc.data();
            pointData.points.forEach((point) => {
              // 포인트 유형(type)에 따라 각각의 포인트를 계산
              switch (point.type) {
                case "MVP":
                  mvpPoints += point.digit;
                  break;
                case "스터디":
                  studyPoints += point.digit;
                  break;
                case "소통":
                  communicationPoints += point.digit;
                  break;
                case "회고":
                  retrospectionPoints += point.digit;
                  break;
                // 다른 포인트 유형에 대한 계산도 추가할 수 있음
              }
            });
            pointData.beePoints.forEach((beePoints) => {
              // 포인트 유형(type)에 따라 각각의 포인트를 계산
              penaltyPoints += beePoints.digit;
            });
          });
        
          // 전체 포인트 합계 계산
          const totalPoints = mvpPoints + studyPoints + communicationPoints + retrospectionPoints;
    
          scores.push({
            name: userData.name,
            mvp: mvpPoints,
            study: studyPoints,
            communication: communicationPoints,
            retrospection: retrospectionPoints,
            penalty: penaltyPoints, // 벌점 포인트
            total: totalPoints, // 전체 포인트 합계
          });
        }
    
        setUserScores(scores);
      } catch (error) {
        console.error("Error fetching user scores:", error);
      }
    };
    

    fetchUserScores();
  }, []);

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>점수 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 파드너십을 관리해보세요.</SubTitle>
      </TitleDiv>
      <BodyDiv>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>이름</TableHeaderCell>
              <TableHeaderCell>MVP</TableHeaderCell>
              <TableHeaderCell>스터디</TableHeaderCell>
              <TableHeaderCell>소통</TableHeaderCell>
              <TableHeaderCell>회고</TableHeaderCell>
              <TableHeaderCell>벌점</TableHeaderCell>
              <TableHeaderCell>점수 관리</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {userScores.map((userScore, index) => (
              <TableRow key={index}>
                <TableCell>{userScore.name}</TableCell>
                <TableCell>{userScore.mvp}</TableCell>
                <TableCell>{userScore.study}</TableCell>
                <TableCell>{userScore.communication}</TableCell>
                <TableCell>{userScore.retrospection}</TableCell>
                <TableCell>{userScore.penalty}</TableCell>
                <TableCell>
                  {/* 여기에 각 사용자에 대한 점수 관리 컴포넌트를 추가하세요 */}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </BodyDiv>
    </DDiv>
  );
};

export default ScorePage;
