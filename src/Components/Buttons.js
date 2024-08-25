import styled from "styled-components";

const AttendancePageButton = styled.button `
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 8px;
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    cursor: pointer;
    border: none;
    height : 50px;

    padding: 12px 52px;
`;

export const EditButton = styled(AttendancePageButton) `
    
    padding: 12px 36px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: rgba(82, 98, 245, 0.1);
    color: var(--primary-blue, #5262f5);
    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

export const SaveButton = styled(AttendancePageButton) `
    color: var(--White, #fff);
    background: var(--primary-blue, #5262f5);
    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

export const CancelButton = styled(AttendancePageButton) `
    background: var(--Gray10, #e4e4e4);
    color: var(--black-card, #2a2a2a);
    margin-right: 16px;
`;

export const AddButton = styled(EditButton)`
    padding : 12px 16px;
`;
