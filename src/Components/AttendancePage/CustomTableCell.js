import { useState } from "react";
import styled from "styled-components";

export const CustomTableCell = ({value, onUpdate, addable, seminarIndex, userIndex}) => {
    const [showButtons, setShowButtons] = useState(false);

    const toggleButtons = () => {
        if (addable == false) 
            setShowButtons(!showButtons);
        };
    
    const updateValue = (newValue) => {
        setShowButtons(false);
        if (onUpdate) 
            onUpdate(userIndex, seminarIndex, newValue);
        };
    
    let backgroundColor = "";
    let color = "";
    let displayValue = "";

    switch (value) {
        case "지각":
            backgroundColor = "#FFE7D9";
            color = "var(--primary-orange, #FF5C00)";
            displayValue = "지각";
            break;
        case "출석":
            backgroundColor = "#E8F6F0";
            color = "var(--primary-green, #64C59A)";
            displayValue = "출석";
            break;
        case "결석":
            backgroundColor = "#FFE6E6";
            color = "var(--error-red, #FF5A5A)";
            displayValue = "결석";
            break;
        default:
            backgroundColor = "#F0F0F0";
            color = "#A0A0A0";
            displayValue = "  ";
    }

    return (
        <CustomTableCellContainer>
            {
                !showButtons
                    ? (
                        <AttendBox
                            onClick={toggleButtons}
                            style={{
                                backgroundColor,
                                color
                            }}>
                            {displayValue}
                        </AttendBox>
                    )
                    : (
                        <div>
                            <AttendButton
                                onClick={toggleButtons}
                                style={{
                                    backgroundColor,
                                    color
                                }}>
                                {displayValue}
                            </AttendButton>

                            <ImageContainer>
                                <Image src={require("../../Assets/img/CheckEditBox.png")} alt="Image Alt Text"/>
                                <ButtonFlexDiv>
                                    <Button
                                        color={"#64C59A"}
                                        background={"#E8F6F0"}
                                        onClick={() => updateValue("출석")}>
                                        출석
                                    </Button>
                                    <Button
                                        color={"#FF5C00"}
                                        background={"#FFE7D9"}
                                        left={8}
                                        right={8}
                                        onClick={() => updateValue("지각")}>
                                        지각
                                    </Button>
                                    <Button
                                        color={"#FF5A5A"}
                                        background={"#FFE6E6"}
                                        onClick={() => updateValue("결석")}>
                                        결석
                                    </Button>
                                </ButtonFlexDiv>
                            </ImageContainer>
                        </div>
                    )
            }
        </CustomTableCellContainer>
    );
};

const CustomTableCellContainer = styled.div `
    position: relative;
`;

const ImageContainer = styled.div `
    position: absolute;
    top: -60px; 
    left: -80px; 
    width: 200px;
    height: 60px;
    z-index: 999; 
`;

const Image = styled.img `
    width: 200px;
    height: 60px;
    object-fit: cover; 
`;

const ButtonFlexDiv = styled.div `
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -6%;
`;

const Button = styled.button `
    border: none;
    margin-right: ${ (props) => props.right}px;
    margin-left: ${ (props) => props.left}px;
    color: ${(props) => props.color};
    background-color: ${(props) => props.background};
    display: flex;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    border-radius: 4px;
`;

// 출석 결석 지각 버튼
const AttendBox = styled.div `
    display: flex;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    border-radius: 4px;
`;

const AttendButton = styled.button `
    display: flex;
    width: 45px;
    height: 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25) inset;
    }
`;