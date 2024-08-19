import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import React, {useEffect, useState} from "react";
import { getAllAttendanceData, postAttendanceData } from "../Api/AttendenceAPI";
import { attendanceList, options } from "../Components/Common/Variables";

/*
- Firebase fireStore 스케쥴 데이터 조회
    - 조회된 데이터 중 날짜로 sort 및 sid 저장
- Firebase fireStore 유저 데이터 조회
- 출석 정보 업데이트
- 과제 등록
- 필터 옵션
- 즉시 업데이트 관련 코드
- 출석 결석 지각 버튼
- Main 화면 코드
*/

const AttendancePage = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [addable, setAddable] = useState(true);
    const [originalAttendanceData, setOriginalAttendanceData] = useState([]);

    // 사용자 출석 정보 다 불러오기
    useEffect(() => {
        const fetchAllAttendanceData = async () => {
            const result = await getAllAttendanceData('3');

            if (result != undefined) {
                setAttendanceData(result);
                setOriginalAttendanceData(JSON.parse(JSON.stringify(result))); // 깊은 복사
            }
        }
        
        fetchAllAttendanceData();
    }, []);

    // filteredUserScores 데이터를 seminar 순서에 맞게 정렬하는 함수
    const getSortedAttendances = (attendances) => {
        // attendances를 seminar 순서에 맞게 정렬합니다.
        const sortedAttendances = Array.from({ length: 11 }, (_, index) => {
            let seminarKey;
            seminarKey = attendanceList[index].name;
            return attendances.find(att => att.seminar === seminarKey) || { seminar: seminarKey, status: null };
        });
        return sortedAttendances;
    };

    // 출석 정보를 저장하는 함수
    const SaveAttendanceData = () => {
        const changedData = [];

        attendanceData.forEach((user, userIndex) => {
            user.attendances.forEach((attendance, attendanceIndex) => {
                const originalAttendance = originalAttendanceData[userIndex]?.attendances[attendanceIndex];
                if (
                    (!originalAttendance || originalAttendance.status !== attendance.status) &&
                    attendance.status && attendance.seminar
                ) {
                    changedData.push({
                        status: attendance.status,
                        seminar: attendance.seminar,
                        email: user.userEmail
                    });
                }
            });
        });

        if (changedData.length > 0) {
            console.log(changedData);
            postAttendanceData(changedData);
        }
    };


    // 핸들러 : 변경 사항 저장을 묻는 핸들러
    const handleEditButtonClick = () => {
        const confirmSave = window.confirm("변경 사항을 저장하시겠습니까?");
        if (confirmSave) {
            SaveAttendanceData();
            setAddable(true);
            setOriginalAttendanceData(JSON.parse(JSON.stringify(attendanceData))); // 원본 데이터 업데이트
            alert("출석 정보가 수정되었습니다.");
        }
    };

    // 핸들러 : 변경 사항 취소를 묻는 핸들러
    const handleCancelClick = () => {
        const confirmSave = window.confirm("변경사항이 저장되지 않습니다.\n취소 하시겠습니까?");
        if (confirmSave) {
            setTimeout(() => {window.location.reload();}, 1000);
        }
    };



    // 핸들러 : DropDown의 토클 역할을 수행하며 변수를 false <-> true로 지정하는 핸들러
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // 핸들러 : DropDown에서 선택한 값으로 selectedOption 변수를 지정하는 핸들러
    const handleOptionClick = (option) => {
        if (option === "전체") {
            setSelectedOption(null);
        } else {
            setSelectedOption(option);
        }
        setIsOpen(false);
    };

    // 변수 : selectedOption에 맞춰 유저 점수를 필터해서 보여주는 부분 (운영진과 잔잔파도가 아닌 경우! (현재 활동중인 파디 + 거친파도))
    const filteredUserScores = selectedOption
        ? attendanceData.filter(
            (userScore) => userScore.part === selectedOption && userScore.role !== "ROLE_ADMIN"
        )
        : attendanceData.filter(
            (userScore) => userScore.role !== "ROLE_ADMIN" 
        );

    
    
    // 핸들러 : 즉시 업데이트 관련 코드 (수정중 즉, 출석, 지각, 결석 중 선택했을 때 선택된 값을 변경해주는 핸들러)
    const updateUser = async (index, idx, newData) => {
        setAttendanceData(prevData => {
            const updatedData = [...prevData];
            // console.log("preview data", updatedData);
            const userIndex = updatedData.findIndex(user => user.userEmail === filteredUserScores[index].userEmail);
            let flag = 0;
            if (userIndex !== -1) {
                if (!updatedData[userIndex].attendances) {
                    updatedData[userIndex].attendances = [];
                }
                

                for (let i = 0; i < updatedData[userIndex].attendances.length; i++){
                    if (updatedData[userIndex].attendances[i].seminar === attendanceList[idx].name) {
                        updatedData[userIndex].attendances[i].status = newData;
                        updatedData[userIndex].attendances[i].seminar = attendanceList[idx].name;
                        flag = 1;
                        break;
                    }
                }
                if (flag === 0) {
                    updatedData[userIndex].attendances.push({ status: newData, seminar: attendanceList[idx].name });

                }
                
            }
            // console.log("check", updatedData);
            return updatedData;
        });
    };
    const CustomTableCell = ({ value, onUpdate, addable, seminarIndex, userIndex }) => {
        const [showButtons, setShowButtons] = useState(false);

        const toggleButtons = () => {
            if(addable == false)
                setShowButtons(!showButtons);
        };

        const updateValue = (newValue) => {
            setShowButtons(false);
            if (onUpdate) onUpdate(userIndex, seminarIndex, newValue);
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
                                    <Image src={require("../Assets/img/CheckEditBox.png")} alt="Image Alt Text" />
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

    // Main 화면 코드
    return (
        <DDiv>
            {/* 상단 바 로그인 정보 표시 */}
            <CommonLogSection />
            
            {/* 페이지 정보 표시 */}
            <TitleDiv>
                <HomeTitle>출결 관리</HomeTitle>
                <BarText/>
                <SubTitle>파트별로 출결을 관리해보세요.</SubTitle>
            </TitleDiv>

            {/* 전체, 취소하기, 수정하기 Header */}
            <FirstDiv>

                {/* 전체 or 파트 선택 */}
                <DropdownWrapper>
                    <DropdownButton onClick={toggleDropdown}>
                        {selectedOption || "전체"}
                        {
                            !isOpen
                                ? (<ArrowTop src={require("../Assets/img/PolygonDown.png")}/>)
                                : (<ArrowTop src={require("../Assets/img/Polygon.png")}/>)
                        }
                    </DropdownButton>

                    {/* isOpen이 true가 되면 보여지는 드롭다운 영역 */}
                    <DropdownContent $isOpen={isOpen}>
                        {
                            options.map((option, index) => (
                                <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
                                    {option}
                                </DropdownItem>
                            ))
                        }
                    </DropdownContent>
                </DropdownWrapper>
            
                {/* 수정하기 / 취소하기, 저장하기 버튼 */}
                {
                    addable
                        ? (
                            <EditButton onClick={() => {setAddable(false)}}>
                                <EditIcon src={require("../Assets/img/EditIcon.png")}/>
                                수정하기
                            </EditButton>
                        )
                        : (
                            <FlexDiv>
                                <CancelButton onClick={handleCancelClick}>취소하기</CancelButton>
                                <SaveButton onClick={handleEditButtonClick}>저장하기</SaveButton>
                            </FlexDiv>
                        )
                }
            </FirstDiv>

            {/* 사용자 출석 정보가 보여지는 Table Content */}
            {
                addable
                    ? (
                        <BodyDiv>
                            {/* <AttendanceTable /> */}
                            <Table>
                                {/* Table - Head */}
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell width={140} style={{ background: "#F8F8F8"}}>
                                            이름
                                        </TableHeaderCell>
                                        {
                                            attendanceList.map((attendance, index) => (
                                                <TableHeaderCell width={152} key = {index}>{attendance?.desc}</TableHeaderCell>
                                        ))}
                                        
                                        
                                        
                                    </TableRow>
                                </TableHead>

                                {/* Table - Body */}
                                <TableBody>
                                    {
                                        filteredUserScores.map((attendanceDataInfo, index) => (
                                            <TableRow key={index}>
                                                {/* 사용자 - 이름 */}
                                                <TableCell color={"#2A2A2A"} width={140}>
                                                    {attendanceDataInfo.name}
                                                </TableCell>

                                                {/* 사용자 - 출석 정보 */}
                                                {
                                                    getSortedAttendances(attendanceDataInfo.attendances).map((attendance, idx) => (
                                                        <TableCell key={idx} width={152}>
                                                            <CustomTableCell value={attendance.status} />
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                        </BodyDiv>
                    )
                    : (
                        <BodyDiv>
                            <Table>
                                {/* Table - Head */}
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell
                                            width={140}
                                            style={{
                                                background: "#F8F8F8"
                                            }}>
                                            이름
                                        </TableHeaderCell>
                                        {
                                            attendanceList.map((attendance, index) => (
                                                <TableHeaderCell width={152} key = {index}>{attendance?.desc}</TableHeaderCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                {/* Table - Body */}
                                <tbody>
                                    {
                                        filteredUserScores.map((attendanceDataInfo, index) => (
                                            <TableRow key={index}>
                                                <TableCell color={"#2A2A2A"} width={140}>
                                                    {attendanceDataInfo.name}
                                                </TableCell>
                                                {
                                                    getSortedAttendances(attendanceDataInfo.attendances).map((attendance, idx) => (
                                                        <TableCell key={idx} width={152}>
                                                            <CustomTableCell
                                                                value={attendance.status}
                                                                idx={idx}
                                                                addable={addable}
                                                                onUpdate={updateUser}
                                                                seminarIndex={idx}
                                                                userIndex={index}
                                                            />
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </BodyDiv>
                    )
            }
        </DDiv>
    );
};

export default AttendancePage;

const DDiv = styled.div `
    background: #fff;
    margin: 0 auto;
    width: calc(100vw - 200px);
    height: 100%;
    overflow-x: hidden;
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
    margin-left: 80px;
    /* max-width: 1300px; */
    width: 90%;
    height: 700px;
    overflow: scroll;
`;

const Table = styled.table `
    width: 1380px;
    border-collapse: collapse;
    border-spacing: 0;
    border-radius: 4px;
    overflow-x: scroll;
    overflow-y: scroll;
    border-radius: 4px 0px 0px 0px;
`;

const TableHead = styled.thead `
    background-color: #eee;
    border-bottom: 1px solid #a3a3a3;
    border-radius: 4px 0px 0px 0px;
    position: sticky;
    top: 0;
    z-index: 300;
`;

const TableRow = styled.tr `
    border-bottom: 1px solid #ddd;
    display: flex;
    border-radius: 4px 0px 0px 0px;
`;

const TableBody = styled.tbody `
    display: block;
    max-height: calc(100% - 48px);
    overflow-y: auto;
    border-bottom: 0.5px solid var(--Gray30, #a3a3a3);
    &:first-child {
        border-left: 1px solid var(--Gray30, #a3a3a3);
    }
`;

const TableHeaderCell = styled.th `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    display: flex;
    width: ${(props) => props.width}px;
    height: 48px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-top: 1px solid var(--Gray30, #a3a3a3);
    border-left: 0.5px solid var(--Gray30, #a3a3a3);
    border-right: 0.5px solid var(--Gray30, #a3a3a3);
    background: #f0f9f5;

    &:first-child {
        border-left: 1px solid var(--Gray30, #a3a3a3);
        border-radius: 4px 0px 0px 0px;
    }

    &:last-child {
        border-radius: 0px 4px 0px 0px;
        border-right: 1px solid var(--Gray30, #a3a3a3);
    }
`;

const TableCell = styled.td `
    color: ${ (props) => props.color};
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    width: ${(props) => props.width}px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border-right: 0.5px solid var(--Gray30, #a3a3a3);
    border-left: 0.5px solid var(--Gray30, #a3a3a3);

    &:first-child {
        border-left: 1px solid var(--Gray30, #a3a3a3);
    }

    &:last-child {
        border-right: 1px solid var(--Gray30, #a3a3a3);
    }
`;

const DropdownWrapper = styled.div `
    position: relative;
    display: inline-block;
    margin-top: 83px;
    margin-left: 83px;
    display: flex;
    width: 125px;
    justify-content: center;
    align-items: center;
    gap: 24px;
    border-radius: 2px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
`;

const DropdownButton = styled.button `
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DropdownContent = styled.div `
    display: ${ (props) => (props.$isOpen? "block" : "none")};
    position: absolute;
    background-color: #f1f1f1;
    z-index: 999;
    width: 125px;
    top: 100%;
    left: 0;
    border: 1px solid #ccc;
    margin-top: 5px;
    border: 1px solid var(--primary-blue, #5262f5);
`;

const DropdownItem = styled.div `
    padding: 10px;
    cursor: pointer;
    background: var(--White, #fff);
    border: 0.5px solid var(--primary-blue, #5262f5);
    text-align: center;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    &:hover {
        background-color: #eeeffe;
    }
`;

const FirstDiv = styled.div `
    display: flex;
    height: 48px;
    width: 100%;
    margin-bottom: 16px;
    margin-top: 83px;
    justify-content: space-between;
    align-items: flex-end;
`;

const EditButton = styled.button `
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 8px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: rgba(82, 98, 245, 0.1);
    color: var(--primary-blue, #5262f5);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    padding: 12px 36px;
    cursor: pointer;
    margin-right: 140px;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

const SaveButton = styled.button `
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 8px;
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    padding: 12px 52px;
    cursor: pointer;
    margin-right: 140px;
    background: var(--primary-blue, #5262f5);
    border: none;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

const FlexDiv = styled.div `
    display: flex;
    align-items: center;
`;

const CancelButton = styled.button `
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 8px;
    background: var(--Gray10, #e4e4e4);
    color: var(--black-card, #2a2a2a);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    padding: 12px 65px;
    cursor: pointer;
    border: none;
    margin-right: 16px;
`;

const EditIcon = styled.img `
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;
const ArrowTop = styled.img `
    width: 14px;
    height: 14px;
    cursor: pointer;
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
