import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {getAllScheduleData} from "../Api/ScheduleAPI";
import {getRankingInfo} from "../Api/ScoreAPI";
import { formatDate, getPartName } from "../Components/Common/Variables";
import { PageInfo } from "../Components/Common/PageInfo";
import { BaseContainer } from "../Components/Common/BaseContainer";
import { ContentContainer, LeftContainer, RightContainer, ScheduleItem, ScheduleFirstRow, ScheduleSecondRow, ContentText, ScrollContainer, PartNameChip, ScheduleTitle } from "../Components/Schedule/ScheduleItem";

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

    // 스케줄 가져오기
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // 전체 스케줄 다 가져오기 (type 상관 없이 [false / true])
                const result = await getAllScheduleData();
                // 스케줄을 저장한다.
                if (result !== undefined) {
                    setSchedule(result);
                }
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };
        fetchSchedules();
    }, []);

    // 랭킹 점수 가져오기
    useEffect(() => {
        const calculateUserRankings = async () => {
            try {
                // 3기 사용자들의 전체 랭킹을 불러온다.
                const result = await getRankingInfo('4');

                // 랭킹을 저장한다.
                if (result !== undefined) {
                    setUserRankings(result);
                } 

            } catch (error) {
                console.error("Error calculating rankings:", error);
            }
        };

        calculateUserRankings();
    }, []);

        // 오늘 날짜 기준으로 오늘 포함해서 아직 지나지 않은 일정들만 반환하는 핸들러
    const getRecentSchedules = () => {
        const today = new Date(); // 오늘 날짜 가져오기
        const filteredSchedules = schedules.filter(
            (schedule) => new Date(schedule.date) >= today
        );
        const sortedSchedules = filteredSchedules.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        return sortedSchedules; // 필터된 스케줄들을 반환
    };

    // Main 화면 코드
    return (
        <BaseContainer>
            {/* 상단 바 로그인 정보 표시 */}
            <CommonLogSection />
            
            {/* 페이지 정보 표시*/}
            <PageInfo title = "홈" subTitle="대시보드로 주요 내용을 확인해보세요."/>

            {/* HomePage */}
            <ContentContainer>
                {/* [1] 일정 업데이트 */}
                <LeftContainer>
                    <UpdateTitle>일정 업데이트</UpdateTitle>

                    <ScrollContainer>
                        {
                            getRecentSchedules().map((schedule, index) => (
                                <ScheduleItem key={index}>
                                    <ScheduleFirstRow key={index}>
                                        <PartNameChip>{getPartName(schedule.part)}</PartNameChip>
                                        <ScheduleTitle>{schedule.title}</ScheduleTitle>
                                    </ScheduleFirstRow>
                                    
                                    <ScheduleSecondRow>
                                        <ContentText>
                                            {
                                                schedule.notice
                                                ? "일시 : "
                                                : "기한 : "
                                            }
                                            {formatDate(schedule.date)}
                                        </ContentText>

                                        <ContentText>
                                            {
                                                schedule.notice
                                                ? "장소 : " + schedule.contentsLocation
                                                : "설명 : " + schedule.content
                                            }
                                        </ContentText>
                                    </ScheduleSecondRow>
                                </ScheduleItem>
                            ))
                        }
                    </ScrollContainer>
                </LeftContainer>

                {/* [2] 점수 업데이트  */}
                <RightContainer>
                    <UpdateTitle>점수 업데이트</UpdateTitle>

                    <ScrollContainer $type={true}>
                        {
                            userRankings.map((user, index) => (
                                <RankingItem key={index}>
                                    <UserInfo key={index}>
                                        <RankingNumCircle
                                            style={{
                                                backgroundColor: index < 3
                                                    ? "#EEEFFE"
                                                    : "#F8F8F8",
                                                color: index < 3
                                                    ? "#5262F5"
                                                    : "#A3A3A3"
                                            }}>
                                            {index + 1}
                                        </RankingNumCircle>
                                        <UserName>{user.name}</UserName>
                                        <UserPart>{getPartName(user.part)}</UserPart>
                                    </UserInfo>
                                    <UserScore>{user.totalBonus}점</UserScore>
                                </RankingItem>
                            ))
                        }
                    </ScrollContainer>
                </RightContainer>
            </ContentContainer>
        </BaseContainer>
    );
};

export default HomePage;

const UpdateTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
`;


const RankingItem = styled.div`
    height: 66px;

    box-sizing: border-box;
    
    /* background-color: skyblue; */
    margin : 10px 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-child{
        border-bottom: none;
    }
    border-bottom: 1px solid #a3a3a3;

`;

const UserInfo = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: green; */
`;

const UserScore = styled.div `
    color: var(--black-background, #1a1a1a);
    text-align: right;
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-right: 16px;
`;


const RankingNumCircle = styled.div `
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

const UserName = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-right: 8px;
`;

const UserPart = styled.div `
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
`;

