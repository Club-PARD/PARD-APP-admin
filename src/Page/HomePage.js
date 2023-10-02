import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";
import { FadeLoader } from "react-spinners";

const DDiv = styled.div`
  background: #fff;
  margin: 0 auto;
  height: 100%;
  /* background-color: red; */
  overflow-y: hidden;
`;
const TitleDiv = styled.div`
  display: flex;
  margin-top: 25px;
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

const ScoreText = styled.div`
  color: var(--black-background, #1a1a1a);
  text-align: right;
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-right: 16px;
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
  /* width: 960px; */
  height: 744px;
  /* background-color: red; */
`;

const RightDiv = styled.div`
  width: 600px;
  height: 744px;
  margin-right: 40px;
  /* background-color: gray; */
`;

const ScheduleDiv = styled.div`
  margin-top: 16px;
  height: 656px;
`;

const ScheduleItem = styled.div`
  width: 600px;
  height: 115px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  margin-bottom: 22px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const ScheduleFirstDiv = styled.div`
  margin-top: 16px;
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PartNameDiv = styled.div`
  border-radius: 4px;
  border: 1px solid var(--black-background, #1a1a1a);
  background: var(--Gray10, #e4e4e4);
  width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  margin-left: 24px;
`;

const DateDiv = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  margin-left: 12px;
`;

const FlextBoxDiv = styled.div`
  display: flex;
  align-items: center;
`;

const ContentText = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  margin-left: 24px;
  margin-top: 8px;
`;

const LeftDiv = styled.div`
  height: 744px;
  width: 540px;
  /* background-color: blue; */
`;

const RankDiv = styled.div`
  margin-top: 16px;
  height: 660px;
  border-radius: 8px;
  border: 1px solid var(--Gray30, #a3a3a3);
  width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  padding-top: 10px;
  /* background-color: red; */
`;

const RankingNumDiv = styled.div`
  width: 500px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
  /* background-color: red; */
`;

const RankingNum = styled.div`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  margin-right: 24px;
  background-color: green;
  color: var(--primary-blue, #5262f5);
  font-family: "Pretendard";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RankingName = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  margin-right: 8px;
`;

const RankingPart = styled.div`
  color: var(--Gray30, #a3a3a3);
  font-family: "Pretendard";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
`;

const RankingFirstDiv = styled.div`
  display: flex;
  align-items: center;
`;

const RankingHR = styled.hr`
  width: 500px;
  height: 0px;
  stroke-width: 1px;
  stroke: var(--Gray30, #a3a3a3);
`;

const HomePage = () => {
  const [schedules, setSchedule] = useState([]);
  const [score, setScore] = useState();
  const [userRankings, setUserRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getDocs(collection(dbService, "schedules"));
        const newData = data.docs.map((doc) => ({ ...doc.data() }));
        setSchedule(newData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const calculateUserRankings = async () => {
      try {
        // 1. Firebase에서 사용자 데이터 가져오기
        const userData = await getDocs(collection(dbService, "users"));

        const rankings = [];

        // 2. 각 사용자에 대한 순위 계산
        for (const userDoc of userData.docs) {
          const userData = userDoc.data();
          const pid = userData.pid;

          // 해당 사용자의 points 데이터 가져오기
          const pointsDocRef = doc(dbService, "points", pid);
          const pointsDoc = await getDoc(pointsDocRef);

          if (pointsDoc.exists()) {
            const pointsData = pointsDoc.data();
            const pointsArray = pointsData.points || [];

            // pointsArray 내부 digit 필드의 값을 합산하여 순위 계산
            const totalPoints = pointsArray.reduce(
              (acc, curr) => acc + curr.digit,
              0
            );

            if (
              userData.member !== "운영진" &&
              userData.member !== "잔잔파도"
            ) {
              rankings.push({
                uid: userDoc.id,
                displayName: userData.name,
                totalPoints: totalPoints,
                part: userData.part,
              });
            }
          }
        }
        setLoading(false);
        setScore(rankings);

        // 3. 사용자를 totalPoints로 정렬하여 순위 설정
        rankings.sort((a, b) => b.totalPoints - a.totalPoints);
        // 순위를 상태에 설정
        setUserRankings(rankings);
        console.log("user Ranking :", rankings);
      } catch (error) {
        console.error("Error calculating rankings:", error);
      }
    };

    calculateUserRankings();
  }, []);

  useEffect(() => {
    console.log("Updated schedules data:", schedules);
  }, [schedules]);

  useEffect(() => {
    console.log("Updated score data:", score);
  }, [score]);

  const getRecentSchedules = () => {
    const sortedSchedules = [...schedules].sort(
      (a, b) => b.dueDate - a.dueDate
    );
    return sortedSchedules.slice(0, 5);
  };

  const override = {
    display: "flex",
    margin: "0 auto",
    marginTop: "300px",
    borderColor: "#5262F5",
    textAlign: "center",
  };

  function getPartName(part) {
    switch (part) {
      case "기획파트":
        return "기획";
      case "iOS파트":
        return "iOS";
      case "서버파트":
        return "서버";
      case "웹파트":
        return "웹";
      case "디자인파트":
        return "디자인";
      case "앱":
        return "앱";
      default:
        return part;
    }
  }

  return (
    <DDiv>
      <CommonLogSection />
      <TitleDiv>
        <HomeTitle>홈</HomeTitle>
        <BarText />
        <SubTitle>대시보드로 주요 내용을 확인해보세요.</SubTitle>
      </TitleDiv>
      <BodyDiv>
        <RightDiv>
          <HomeTitle>일정 업데이트</HomeTitle>
          <ScheduleDiv>
            {getRecentSchedules().map((schedule, index) => (
              <ScheduleItem key={index}>
                <ScheduleFirstDiv key={index}>
                  <FlextBoxDiv>
                    <PartNameDiv>{getPartName(schedule.part)}</PartNameDiv>
                    <DateDiv>{schedule.title}</DateDiv>
                  </FlextBoxDiv>
                </ScheduleFirstDiv>
                <ContentText>
                  일시 :{" "}
                  {format(
                    fromUnixTime(schedule.dueDate.seconds),
                    "M월 d일 EEEE HH:mm",
                    { locale: koLocale } // 한국어 로케일 설정
                  )}
                </ContentText>
                <ContentText>장소 : {schedule.place}</ContentText>
              </ScheduleItem>
            ))}
          </ScheduleDiv>
        </RightDiv>
        <LeftDiv>
          <HomeTitle>점수 업데이트</HomeTitle>
          <RankDiv>
            {loading ? (
              <>
                <FadeLoader
                  color="#5262F5"
                  loading={loading}
                  cssOverride={override}
                  size={50}
                />
              </>
            ) : (
              <>
                {userRankings.map((user, index) => (
                  <>
                    <RankingNumDiv key={user.uid}>
                      <RankingFirstDiv key={index}>
                        <RankingNum
                          style={{
                            backgroundColor: index < 3 ? "#EEEFFE" : "#F8F8F8",
                            color: index < 3 ? "#5262F5" : "#A3A3A3",
                          }}
                        >
                          {index + 1}
                        </RankingNum>
                        <RankingName>{user.displayName}</RankingName>
                        <RankingPart>{user.part}</RankingPart>
                      </RankingFirstDiv>
                      <ScoreText>{user.totalPoints}점</ScoreText>
                    </RankingNumDiv>
                    <RankingHR />
                  </>
                ))}
              </>
            )}
          </RankDiv>
        </LeftDiv>
      </BodyDiv>
    </DDiv>
  );
};

export default HomePage;
