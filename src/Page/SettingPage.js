import styled from "styled-components";
import { BaseContainer } from "../Components/Common/BaseContainer";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { PageInfo } from "../Components/Common/PageInfo";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { AtomSelectedGeneration } from "../Context/Atom";

function SettingPage() {

    const GenerationList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [SelectedGeneration, setSelectedGeneration] = useRecoilState(AtomSelectedGeneration);

    const handleChangeGeneartion = (generation) => {
        if(generation > 0)
            setSelectedGeneration(generation);
        sessionStorage.setItem('selectedGeneration', generation);
    }
    return (
        <BaseContainer>
            <CommonLogSection />
            <PageInfo title="설정" subTitle="파드 앱 관리자 설정 관련 페이지입니다." /> {/* 점수 관리 카테고리 드롭다운 */}
            
            <SelectGenerationContainer>
                <Title>현재 기수 설정</Title>
                <GeneartionList>
                    {GenerationList.map((generation, index) => (
                        <GenerationItem key={index} $generation={generation}  $data={SelectedGeneration} onClick={() => handleChangeGeneartion(generation)}>{generation}기</GenerationItem>
                    ))}
                </GeneartionList>
            </SelectGenerationContainer>
        </BaseContainer>
    )
}

export default SettingPage;

const SelectGenerationContainer = styled.div`
    margin-top: 89px;
`;

const Title = styled.p`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const GeneartionList = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 310px;
`;
const GenerationItem = styled.div`
    width: 50px;
    height : 30px;
    border : 1px solid gray;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.$data === props.$generation ? "#5262f5" : "#9f9f9f10"};
    color : ${props => props.$data === props.$generation ? "white" : "#gray"};
    margin-right: 10px;
    margin-bottom: 10px;

    transition: background-color 0.5s ease, color 0.5s ease;

    &:hover{
        background-color: #5262f5;
        color : white;
    }
`;