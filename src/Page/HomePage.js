import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {FadeLoader} from "react-spinners";
import {getAllScheduleData} from "../Api/ScheduleAPI";
import {getRankingInfo} from "../Api/ScoreAPI";
import { formatDate, getPartName } from "../Components/Common/Variables";

/*
- Firebase fireStore 스케쥴 데이터 조회
- Firebase fireStore 유저 데이터 조회
    - Firebase에서 사용자 데이터 가져오기
    - 각 사용자에 대한 순위 계산
    - 사용자를 totalPoints로 정렬하여 순위 설정
- 로딩 css
- Main 화면 코드
*/

const HomePage = () => {
    const [schedules, setSchedule] = useState([]);
    const [userRankings, setUserRankings] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // 1. 전체 스케줄 다 가져오기 (type 상관 없이 [false / true])
                const result = await getAllScheduleData();
                if (result != undefined) {
                    setSchedule(result);
                } 

            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };

        fetchSchedules();
    }, []);

    useEffect(() => {
        const calculateUserRankings = async () => {
            try {
                // Firebase에서 사용자 데이터 가져오기 (전체 문서)
                const result = await getRankingInfo('3');
                // 순위를 상태에 설정
                if (result != undefined) {
                    setUserRankings(result);
                } 

            } catch (error) {
                console.error("Error calculating rankings:", error);
            }
        };

        calculateUserRankings();
    }, []);

    // 최근 다섯 개의 스케줄 return하는 핸들러
    const getRecentSchedules = () => {
        const sortedSchedules = [...schedules].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
        return sortedSchedules.slice(0, 5);
    };

    // Main 화면 코드
    return (
        <DDiv>
            {/* 상단 바 로그인 정보 표시 */}
            <CommonLogSection/> {/* 페이지 정보 표시*/}
            <TitleDiv>
                <HomeTitle>홈</HomeTitle>
                <BarText/>
                <SubTitle>대시보드로 주요 내용을 확인해보세요.</SubTitle>
            </TitleDiv>

            {/* HomePage */}
            <BodyDiv>
                {/* [1] 일정 업데이트 */}
                <RightDiv>
                    <HomeTitle>일정 업데이트</HomeTitle>

                    <ScheduleDiv>
                        {
                            getRecentSchedules().map((schedule, index) => (
                                <ScheduleItem key={index}>
                                    {/* 공지타입 : 공지 제목 */}
                                    <ScheduleFirstDiv key={index}>
                                        <FlextBoxDiv>
                                            <PartNameDiv $isPastEvent={schedule.isPastEvent}>{getPartName(schedule.part)}</PartNameDiv>
                                            <DateDiv>{schedule.title}</DateDiv>
                                        </FlextBoxDiv>
                                    </ScheduleFirstDiv>

                                    {/* 일시 */}
                                    <ContentText>
                                        {
                                            schedule.notice
                                                ? "일시 : "
                                                : "기한 : "
                                        }
                                        {formatDate(schedule.date)}
                                    </ContentText>

                                    {/* 장소 */}
                                    <ContentText>
                                        {
                                            schedule.notice
                                                ? "장소 : " + schedule.contentsLocation
                                                : "설명 : " + schedule.content
                                        }
                                        {/* 장소 : {schedule.place} */}
                                    </ContentText>
                                </ScheduleItem>
                            ))
                        }
                    </ScheduleDiv>
                </RightDiv>

                {/* [2] 점수 업데이트  */}
                <LeftDiv>
                    <HomeTitle>점수 업데이트</HomeTitle>

                    <RankDiv>
                        {
                            userRankings.map((user, index) => (
                                <div key={index}>
                                    <RankingNumDiv>
                                        <RankingFirstDiv key={index}>
                                            <RankingNum
                                                style={{
                                                    backgroundColor: index < 3
                                                        ? "#EEEFFE"
                                                        : "#F8F8F8",
                                                    color: index < 3
                                                        ? "#5262F5"
                                                        : "#A3A3A3"
                                                }}>
                                                {index + 1}
                                            </RankingNum>
                                            <RankingName>{user.name}</RankingName>
                                            <RankingPart>{getPartName(user.part)}</RankingPart>
                                        </RankingFirstDiv>
                                        <ScoreText>{user.totalBonus}점</ScoreText>
                                    </RankingNumDiv>
                                    <RankingHR/>
                                </div>
                            ))
                        }
                    </RankDiv>
                </LeftDiv>
            </BodyDiv>
        </DDiv>
    );
};

export default HomePage;

const DDiv = styled.div `
    background: #fff;
    margin: 0 auto;
    height: 100%;
    width: calc(100vw - 200px);
    overflow-y: hidden;
`;

const TitleDiv = styled.div `
    display: flex;
    margin-top: 25px;
    margin-left: 80px;
    align-items: center;
`;

const HomeTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
`;

const SubTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-top: 1px;
`;

const ScoreText = styled.div `
    color: var(--black-background, #1a1a1a);
    text-align: right;
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-right: 16px;
`;

const BarText = styled.div `
    width: 2px;
    height: 24px;
    margin-top: 1px;
    margin-left: 12px;
    margin-right: 14px;
    background: linear-gradient(92deg, #5262f5 0%, #7b3fef 100%);
`;

const BodyDiv = styled.div `
    display: flex;
    margin-top: 83px;
    margin-left: 80px;
    height: 744px;
`;

const RightDiv = styled.div `
    width: 600px;
    height: 744px;
    margin-right: 40px;
`;

const ScheduleDiv = styled.div `
    margin-top: 16px;
    height: 656px;
`;

const ScheduleItem = styled.div `
    width: 600px;
    height: 115px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    margin-bottom: 22px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
`;

const ScheduleFirstDiv = styled.div `
    margin-top: 16px;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
`;

const PartNameDiv = styled.div `
    border-radius: 4px;
    border: 1px solid var(--black-background, #1a1a1a);
    background: ${props => props.$isPastEvent? 'pink': 'var(--Gray30, #b0b0b0)'};
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

const DateDiv = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-left: 12px;
`;

const FlextBoxDiv = styled.div `
    display: flex;
    align-items: center;
`;

const ContentText = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 12px;
    margin-left: 24px;
    margin-top: 10px;
`;

const LeftDiv = styled.div `
    height: 744px;
    width: 540px;
`;

const RankDiv = styled.div `
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
`;

const RankingNumDiv = styled.div `
    width: 500px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 8px;
`;

const RankingNum = styled.div `
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

const RankingName = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-right: 8px;
`;

const RankingPart = styled.div `
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
`;

const RankingFirstDiv = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RankingHR = styled.hr `
    width: 500px;
    height: 0px;
    stroke-width: 1px;
    stroke: var(--Gray30, #a3a3a3);
`;