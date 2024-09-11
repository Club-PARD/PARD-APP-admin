import styled from "styled-components";

export const ContentContainer = styled.div `
    display: flex;
    margin-top: 83px;
    /* background-color: red; */

    @media (max-width: 1050px) {
        height: auto;
        flex-direction: column;
        /* background-color: green; */
    }
`;

export const LeftContainer = styled.div `
    flex : 1;
    margin-right: 30px;
    /* background-color: yellow; */

    @media (max-width: 1050px) {
        margin-right: 0;
        margin-bottom: 20px;
    }
`;

export const RightContainer = styled.div `
    flex : 1;
    /* background-color: green; */

`;

export const ScrollContainer = styled.div `
    margin-top: 16px;
    width: 100%;
    height: 60vh;
    overflow-y: scroll;

    /* 스크롤바 숨기기 */
    ::-webkit-scrollbar {
        display : ${props => props.$type === true ? "none" : "none"}; /* Chrome, Safari, Edge, Opera */
    }
    
    -ms-overflow-style: none;  /* IE 10+ */
    scrollbar-width: none;  /* Firefox */
    /* background-color: ${props => props.$type === true ? "yellow" : "green"}; */


    border-radius: ${props => props.$type === true ? "8px" : ""};
    border: ${props => props.$type === true ? "1px solid #a3a3a3" : ""};
    box-sizing: ${props => props.$type === true ? "border-box" : ""};
`;

export const ScheduleItem = styled.div `
    width : 100%;
    height: 120px;

    background-color: #ffffff;

    border: 1px solid #a3a3a3;
    border-radius: 8px;
    box-sizing: border-box;

    display: flex;
    flex-direction: ${props => props.$type === true? "row" : "column"};
    justify-content: space-between;
    
    margin-bottom: 22px;
    padding : 16px 24px;
    &:last-child{
        margin-bottom: 0px;
    }
`;

export const ScheduleFirstRow = styled.div `
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    /* background-color: violet; */
`;

export const ScheduleSecondRow = styled.div`
    width: 100%;
    height : 48px;
    display: flex;
    flex-direction: column;
    /* background-color: skyblue; */
`;

export const ContentText = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
`;

export const PartNameChip = styled.div `
    border-radius: 4px;
    border: 1px solid var(--black-background, #1a1a1a);
    background: #E4E4E4;
    
    width: 60px;
    height : 100%;
    
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--black-background, #1a1a1a);

    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
`;

export const ScheduleTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-left: 12px;
`;


export const ScheduleInfoContainer = styled.div`
    /* background-color: red; */
`;

export const ButtonListContainer = styled.div`
    /* background-color: orange; */
    display: flex;
    flex-direction : column;
    /* justify-content: space-between; */
`;