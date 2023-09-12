import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";

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

const AlertText = styled.div`
  color: var(--Gray30, #a3a3a3);
  /* Body/B5-M-14 */
  font-family: "Pretendard";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  margin-left: 8px;
`;

const BodyDiv = styled.div`
  display: flex;
  margin-top: 83px;
  margin-left: 80px;
  width: 960px;
  height: 744px;
  /* background-color: red; */
`;

const RightDiv = styled.div`
  width: 480px;
  height: 744px;
  margin-right: 40px;
  /* background-color: gray; */
`;

const LeftDiv = styled.div`
  height: 744px;
  width: 480px;
  /* background-color: blue; */
`;

const ScheduleDiv = styled.div`
  margin-top: 16px;
  height: 696px;
`;

const ScheduleItem = styled.div`
  width: 480px;
  height: 120px;
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

const DelteButton = styled.button`
  width: 55px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid var(--Gray30, #a3a3a3);
  background: var(--Gray-5, #f8f8f8);
  color: var(--Gray30, #a3a3a3);
  font-family: "Pretendard";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  margin-bottom: 3px;
`;

const DeleteIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 2px;
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

const SchedulePage = () => {
  const [schedules, setSchedule] = useState([]);

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

  const getRecentSchedules = () => {
    const sortedSchedules = [...schedules].sort(
      (a, b) => b.dueDate - a.dueDate
    );
    return sortedSchedules.slice(0, 5);
  };

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>일정 관리</HomeTitle>
        <BarText />
        <SubTitle>중요한 일정을 공지하고 알림을 발송하세요.</SubTitle>
        <AlertText>* 일정 전날 오후 9시에 알림이 발송됩니다.</AlertText>
      </TitleDiv>
      <BodyDiv>
        <RightDiv>
          <HomeTitle>공식 일정</HomeTitle>
          <ScheduleDiv>
            {getRecentSchedules().map((schedule, index) => (
              <ScheduleItem key={index}>
                <ScheduleFirstDiv key={index}>
                  <FlextBoxDiv>
                    <PartNameDiv>{schedule.part}</PartNameDiv>
                    <DateDiv>{schedule.description}</DateDiv>
                  </FlextBoxDiv>
                  <DelteButton>
                    <DeleteIcon src={require("../Assets/img/DeleteIcon.png")} />
                    삭제
                  </DelteButton>
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
          <HomeTitle>과제 일정</HomeTitle>
          <ScheduleDiv>
            {getRecentSchedules().map((schedule, index) => (
              <ScheduleItem key={index}>
                <ScheduleFirstDiv key={index}>
                  <FlextBoxDiv>
                    <PartNameDiv>{schedule.part}</PartNameDiv>
                    <DateDiv>{schedule.description}</DateDiv>
                  </FlextBoxDiv>
                  <DelteButton>
                    <DeleteIcon src={require("../Assets/img/DeleteIcon.png")} />
                    삭제
                  </DelteButton>
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
        </LeftDiv>
      </BodyDiv>
    </DDiv>
  );
};

export default SchedulePage;
