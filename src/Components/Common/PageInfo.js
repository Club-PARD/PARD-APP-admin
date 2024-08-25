import styled from "styled-components";

export const PageInfo = ({ title, subTitle }) => {
    return (
        <TitleDiv>
            <PageTitle>{title}</PageTitle>
            <TextBar/>
            <PageSubTitle>{subTitle}</PageSubTitle>
        </TitleDiv>
    );
}
const TitleDiv = styled.div `
    display: flex;
    margin-top: 25px;
    margin-left: 80px;
    align-items: center;
`;

const PageTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
`;

const PageSubTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-top: 1px;
`;

const TextBar = styled.div `
    width: 2px;
    height: 24px;
    margin-top: 1px;
    margin-left: 12px;
    margin-right: 14px;
    background: linear-gradient(92deg, #5262f5 0%, #7b3fef 100%);
`;