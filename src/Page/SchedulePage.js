import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { format, differenceInDays } from "date-fns";
import koLocale from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from "../Styles/calendar.module.scss";
import { deleteScheduleData, getAllScheduleData, patchScheduleData, postScheduleData } from "../Api/ScheduleAPI";
import { formatDate, getPartName, options} from "../Components/Common/Variables";
import { PageInfo } from "../Components/Common/PageInfo";
import { BaseContainer } from "../Components/Common/BaseContainer";

/* 
- Firebase fireStore 스케쥴 데이터 조회
    - 조회된 데이터 중에 스케쥴 구분 및 sort
    - 조회된 데이터 중에 과제  구분 및 sort
    - 문서 삭제 기능
- Modal 창 관련 코드
    - 파트 선택 토글
    - 모달 관련 Style 코드
- 날짜 관련 Hook
    - d-day 구하기
- 과제 등록
- 일정 등록
- Main 화면 코드
*/

const SchedulePage = () => {
    const [schedules, setSchedule] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // 스케쥴 조회
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // 1. 전체 스케줄 다 가져오기 (type 상관 없이 [false / true])
                const result = await getAllScheduleData();

                // 2. useState 변수에 저장
                setSchedule(result);
            } catch (error) {
                console.error("[Error] getAllScheduleData():", error);
            }
        };

        fetchSchedules();
    }, []);

    // 핸들러 : 조회된 데이터 중에 스케쥴 구분 및 sort
    const getRecentSchedules = () => {
        // console.log(schedules); 날짜 순으로 정렬된 버전
        const sortedSchedules = [...schedules].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        // 날짜 순으로 정렬된 버전을 '전체' 스케줄로 필터한 버전
        const filteredSchedules = sortedSchedules.filter(
            schedule => schedule.part === "전체"
        );

        return filteredSchedules;
    };

    // 핸들러 : 조회된 데이터 중에 과제 구분 및 sort
    const getRecenTask = () => {
        // console.log(schedules); 날짜 순으로 정렬된 버전
        const sortedSchedules = [...schedules].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        // 날짜 순으로 정렬된 버전을 '전체' 스케줄로 필터한 버전
        const filteredSchedules = sortedSchedules.filter(
            schedule => schedule.part != "전체"
        );

        return filteredSchedules;
    };

    // 핸들러 : 문서 삭제 기능 (sid값을 받아서 이를 토대로 삭제 진행)
    const handleDeleteSchedule = async (scheduleId) => {
        const userConfirmed = window.confirm("일정을 삭제하시겠습니까?");

        if (userConfirmed) {
            try {
                const result = await deleteScheduleData(scheduleId);
                // 3. 삭제가 성공하면 화면을 새로고침
                alert("일정이 삭제되었습니다.");
                window
                    .location
                    .reload();
            } catch (error) {
                console.error("Error deleting schedule:", error);
            }
        }
    };

    // Modal 창 관련 코드
    const openModal = (schedule) => {
        setIsModalOpen(true);
        setIsRegisterModalOpen(true);
        setSelectedSchedule(schedule);
    };

    const openTaskModal = (schedule) => {
        setIsModalOpen(true);
        setIsRegisterModalOpen(false);
        setSelectedSchedule(schedule);
    };

    const closeModal = () => {
        const result = window.confirm("변경사항을 저장하지 않고 나가시겠습니까?");
        if (result) {
            setSelectedSchedule({});
            setIsModalOpen(false);
        }
    };

    const closeModalWidhtUppdate = () => {
        setIsModalOpen(false);
    };



    // 모든 일정 삭제 함수
    const handleDeleteAll = async (type) => {
        const confirmMessage = type === 'schedule'
            ? "모든 공식 일정을 삭제하시겠습니까?"
            : "모든 과제 일정을 삭제하시겠습니까?";

        const userConfirmed = window.confirm(confirmMessage);

        if (userConfirmed) {
            try {
                const itemsToDelete = schedules.filter(
                    schedule => type === 'schedule'
                        ? schedule.part === "전체"
                        : schedule.part !== "전체"
                );

                const deletePromises = itemsToDelete.map(
                    item => deleteScheduleData(item.scheduleId)
                );

                await Promise.all(deletePromises);

                const successMessage = type === 'schedule'
                    ? "모든 공식 일정이 삭제되었습니다."
                    : "모든 과제 일정이 삭제되었습니다.";
                alert(successMessage);

                // 로컬 상태 업데이트
                setSchedule(schedules.filter(
                    schedule => type === 'schedule'
                        ? schedule.part !== "전체"
                        : schedule.part === "전체"
                ));
            } catch (error) {
                console.error(`Error deleting all ${type}s:`, error);
                alert(
                    `${type === 'schedule'
                        ? '공식 일정'
                        : '과제 일정'} 삭제 중 오류가 발생했습니다.`
                );
            }
        }
    };

    // Main 화면 코드
    return (
        <BaseContainer>
            {/* 상단 바 로그인 정보 표시  */}
            <CommonLogSection />
            
            {/* 페이지 정보 표시 */}
            <PageInfo title = "일정 관리" subTitle = "중요한 일정을 공지하고 알림을 발송하세요."/>

            {/* 공식 일정과 과제 일정이 보여지는 Content */}
            <BodyDiv>

                {/* 공식 일정 */}
                <RightDiv>
                    <FirstDiv>
                        <FlexBox>
                            <ScheduleTitle>공식 일정</ScheduleTitle>
                            <DeleteButton onClick={() => handleDeleteAll('schedule')}>일정 전체 삭제</DeleteButton>
                        </FlexBox>

                        <EditButton onClick={openModal}>
                            <EditIcon src={require("../Assets/img/ScheduleCIcon.png")}/>
                            공식 일정 추가하기
                        </EditButton>
                    </FirstDiv>
                    <ScheduleDiv>
                        {
                            getRecentSchedules().map((schedule, index) => (
                                <ScheduleItem key={index}>
                                    <ScheduleFirstDiv key={index}>
                                        <FlextBoxDiv>
                                            <PartNameDiv $isPastEvent={schedule.isPastEvent}>{schedule.part}</PartNameDiv>
                                            <DateDiv>{schedule.title}</DateDiv>
                                        </FlextBoxDiv>
                                        <div>
                                            <DelteButton onClick={() => handleDeleteSchedule(schedule.scheduleId)}>
                                                <DeleteIcon src={require("../Assets/img/DeleteIcon.png")}/>
                                                삭제
                                            </DelteButton>
                                            <DelteButton onClick={() => openModal(schedule)}>
                                                <DeleteIcon src={require("../Assets/img/EditIcon.png")}/>
                                                수정
                                            </DelteButton>
                                        </div>
                                    </ScheduleFirstDiv>
                                    <ContentText>
                                        일시 : {formatDate(schedule.date)}
                                    </ContentText>
                                    <ContentText>장소 : {schedule.contentsLocation}</ContentText>
                                </ScheduleItem>
                            ))
                        }
                    </ScheduleDiv>
                </RightDiv>

                {/* 과제 일정 */}
                <LeftDiv>
                    <FirstDiv>
                        <FlexBox>
                            <ScheduleTitle>과제 일정</ScheduleTitle>
                            <DeleteButton onClick={() => handleDeleteAll('task')}>과제 전체 삭제</DeleteButton>
                        </FlexBox>
                        <EditButton onClick={openTaskModal}>
                            <EditIcon src={require("../Assets/img/ScheduleCIcon.png")}/>
                            과제 일정 추가하기
                        </EditButton>
                    </FirstDiv>
                    <ScheduleDiv>
                        {
                            getRecenTask().map((schedule, index) => (
                                <ScheduleItem key={index}>
                                    <ScheduleFirstDiv key={index}>
                                        <FlextBoxDiv>
                                            <PartNameDiv $isPastEvent={schedule.isPastEvent}>{getPartName(schedule.part)}</PartNameDiv>
                                            <DateDiv>{schedule.title}</DateDiv>
                                        </FlextBoxDiv>
                                        <div>
                                            <DelteButton onClick={() => handleDeleteSchedule(schedule.scheduleId)}>
                                                <DeleteIcon src={require("../Assets/img/DeleteIcon.png")}/>
                                                삭제
                                            </DelteButton>
                                            <DelteButton onClick={() => openTaskModal(schedule)}>
                                                <DeleteIcon src={require("../Assets/img/EditIcon.png")}/>
                                                수정
                                            </DelteButton>
                                        </div>
                                    </ScheduleFirstDiv>
                                    <ContentText>
                                        설명 : {schedule.content || "내용 없음"}
                                    </ContentText>
                                    <ContentText>
                                        마감 : {formatDate(schedule.date)}
                                    </ContentText>

                                </ScheduleItem>
                            ))
                        }
                    </ScheduleDiv>
                </LeftDiv>

                {isOpen}
            </BodyDiv>

            {/* 추가하기 모달 Content */}
            <Modal
                isOpen={isModalOpen}
                isRegisterModalOpen={isRegisterModalOpen}
                onClose={() => closeModal()}
                closeModalWidhtUppdate={() => closeModalWidhtUppdate()}
                selectedSchedule={selectedSchedule}/>
        </BaseContainer>
    );
};

export default SchedulePage;

const Modal = ({isOpen, isRegisterModalOpen, onClose, closeModalWidhtUppdate, selectedSchedule}) => {
    const [isToggle, setIsToggle] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputText, setInputText] = useState("");
    const [inputAbout, setInputAbout] = useState("");
    const [selectedTime, setSelectedTime] = useState(new Date());

    useEffect(() => {
        if (selectedSchedule) {
            setInputText(selectedSchedule?.title);

            // 서버로부터 받은 날짜를 Date 객체로 변환
            const dateObject = new Date(selectedSchedule?.date);

            // Date 객체가 유효한지 확인
            if (!isNaN(dateObject.getTime())) {
                // 유효한 경우에만 상태에 저장
                setSelectedTime(dateObject);
            } else {
                // console.error("Invalid Date format:", selectedSchedule?.date); 유효하지 않은 경우에 대한 처리
                setSelectedTime(null);
            }

            if (selectedSchedule?.content) {
                // 과제
                setInputAbout(selectedSchedule?.content);
                setSelectedOption(selectedSchedule?.part);
            } else {
                // 일정
                setInputAbout(selectedSchedule?.contentsLocation);
            }
        } else {
            setInputText('');
            setInputAbout('');
            setSelectedTime(new Date());
            setSelectedOption(null);
        }
    }, [isOpen]);

    // 파트 선택 토글
    const toggleDropdown = () => {
        setIsToggle(!isToggle);
    };

    const handleOptionClick = (option) => {
        if (option === "전체") {
            setSelectedOption(null);
        } else {
            setSelectedOption(option);
        }
        setIsToggle(false);
    };

    const handleInputChange = (e) => {
        const text = e.target.value || '';
        if (
            text?.length <= 10
        ) {
            setInputText(text);
        }
    };

    const handlePlaceChange = (e) => {
        const text = e.target.value || '';
        if (
            text?.length <= 10
        ) {
            setInputAbout(text);
        }
    };

    const handleAboutChange = (e) => {
        const text = e.target.value || '';
        if (
            text?.length <= 20
        ) {
            setInputAbout(text);
        }
    };

    const handleDateChange = (date) => {
        setSelectedTime(date);
    };

    // d-day 구하는 핸들러
    function calculateDateDifference(selectedDateStr) {
        // 1. 오늘 날짜 구하기
        const today = new Date();

        // 2. 선택한 날짜 구하기
        const selectedDate = new Date(selectedDateStr);

        // 3. 선택한 날짜와 오늘 날짜의 차이 구하기
        const daysDifference = differenceInDays(selectedDate, today);

        // 4. 차이를 포맷하기
        const formattedDifference = daysDifference === 0
            ? "D-day"
            : `D-${Math.abs(daysDifference) + 1}`;

        return formattedDifference;
    }

    // 핸들러 : 일정 등록
    const handleRegisterButtonClicked = () => {
        const result = window.confirm("일정을 추가하시겠습니까?");
        if (result) {
            AddScedule();
        }
    };
    const handleUpdateSchedule = () => {
        const result = window.confirm("일정을 수정하시겠습니까?");
        if (result) {
            UpdateSchedule();
        }
    }

    // 핸들러 : '전체'에 대한 일정 추가 (유효성 검사 후 실제 DB로 등록)
    const AddScedule = async () => {
        // 유효성 검사
        if (inputAbout === "" || inputText === "") {
            window.confirm("빈칸을 확인해주세요");
        } else {
            try {
                const addScheduleInfo = {
                    title: inputText,
                    content: "",
                    part: "전체",
                    date: new Date(selectedTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                    contentsLocation: inputAbout,
                    notice: true,
                    remaingDay: 0,
                    pastEvent: false
                }
                const result = await postScheduleData(addScheduleInfo);

                alert("일정이 추가되었습니다.");
                closeModalWidhtUppdate();
                setTimeout(() => {
                    window
                        .location
                        .reload();
                }, 1000);
            } catch (error) {
                console.error("일정 추가 실패:", error);
            }
        }
    };

    const UpdateSchedule = async () => {
        if (inputAbout === "" || inputText === "") {
            window.confirm("빈칸을 확인해주세요");
        } else {
            try {
                const addScheduleInfo = {
                    title: inputText,
                    content: "",
                    part: "전체",
                    date: new Date(selectedTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                    contentsLocation: inputAbout,
                    notice: true,
                    remaingDay: 0,
                    pastEvent: false
                }
                const result = await patchScheduleData(
                    addScheduleInfo,
                    selectedSchedule
                        ?.scheduleId
                );

                alert("일정이 추가되었습니다.");
                closeModalWidhtUppdate();
                setTimeout(() => {
                    window
                        .location
                        .reload();
                }, 1000);
            } catch (error) {
                console.error("일정 추가 실패:", error);
            }
        }
    }

    // 핸들러 : 과제 등록
    const handleRegisterTaskButtonClicked = () => {
        const result = window.confirm("과제를 추가하시겠습니까?");
        if (result) {
            AddTask();
        }
    };

    const handleUpdateTask = () => {
        const result = window.confirm("과제를 수정하시겠습니까?");
        if (result) {
            UpdateTask();
        }
    }

    // 핸들러 : '과제'에 대한 일정 추가 (유효성 검사 후 실제 DB로 등록)
    const AddTask = async () => {
        // 유효성 검사
        if (!inputAbout || !inputText || !selectedOption || !selectedTime) {
            alert("모든 필드를 채워주세요.");
            return;
        } else {
            try {
                const addScheduleInfo = {
                    title: inputText,
                    content: inputAbout,
                    part: selectedOption,
                    date: new Date(selectedTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                    contentsLocation: "",
                    notice: false,
                    remaingDay: 0,
                    pastEvent: false
                }
                const result = await postScheduleData(addScheduleInfo);
                alert("과제 일정이 추가되었습니다.");
                closeModalWidhtUppdate();
                setTimeout(() => {window.location.reload();}, 1000);
            } catch (error) {
                console.error("과제 일정 추가 실패:", error);
            }
        }
    };

    const UpdateTask = async () => {
        if (!inputAbout || !inputText || !selectedOption || !selectedTime) {
            alert("모든 필드를 채워주세요.");
            return;
        } else {
            try {
                const addScheduleInfo = {
                    title: inputText,
                    content: inputAbout,
                    part: selectedOption,
                    date: new Date(selectedTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                    contentsLocation: "",
                    notice: false,
                    remaingDay: 0,
                    pastEvent: false
                }
                const result = await patchScheduleData(
                    addScheduleInfo,
                    selectedSchedule
                        ?.scheduleId
                );
                alert("과제 일정이 수정되었습니다.");
                closeModalWidhtUppdate();
                setTimeout(() => {
                    window
                        .location
                        .reload();
                }, 1000);
            } catch (error) {
                console.error("과제 일정 수정 실패:", error);
            }
        }
    }
    return (
        <ModalWrapper $isOpen={isOpen}>
            <ModalContent>
                <ModalTitleDiv>
                    {
                        isRegisterModalOpen
                            ? (<ModalTitle>공식 일정 추가하기</ModalTitle>)
                            : (<ModalTitle>과제 추가</ModalTitle>)
                    }
                    <CancelIcon src={require("../Assets/img/CancelButton.png")} onClick={onClose}/>
                </ModalTitleDiv>
                {
                    isRegisterModalOpen
                        ? (
                            <div>
                                <ModalSubTitle>
                                    <ModalContents color={"#111"} $right={46} $weight={500}>
                                        일정 제목
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <ReasonInput
                                            value={inputText || ""}
                                            onChange={handleInputChange}
                                            placeholder="일정 제목을 10자 이내로 작성해주세요."/>
                                        <InputNumNum>{
                                                inputText
                                                    ?.length
                                            }/10</InputNumNum>
                                    </ModalContents>
                                </ModalSubTitle>
                                <ModalSubTitle $top={54}>
                                    <ModalContents color={"#111"} $right={81} $weight={500}>
                                        일시
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <DatePicker
                                            placeholderText="날짜를 선택하세요"
                                            className={style.datePicker}
                                            calendarClassName={style.calenderWrapper}
                                            selected={selectedTime}
                                            onChange={handleDateChange}
                                            showTimeSelect="showTimeSelect"
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            shouldCloseOnSelect={false}/>
                                    </ModalContents>
                                </ModalSubTitle>
                                <ModalSubTitle $top={54}>
                                    <ModalContents color={"#111"} $right={81} $weight={500}>
                                        장소
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <ReasonInput
                                            value={inputAbout || ""}
                                            onChange={handlePlaceChange}
                                            placeholder="일정 장소를 10자 이내로 작성해주세요."/>
                                        <InputNumNum>{
                                                inputAbout
                                                    ?.length
                                            }/10</InputNumNum>
                                    </ModalContents>
                                </ModalSubTitle>
                                <ModalSubTitle $top={50}>
                                    <ModalContents color={"#111"} $right={46} $weight={500}>
                                        예시
                                        <SubMessage>* 앱 노출 화면</SubMessage>
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600} $top={55}>
                                        <PreView>
                                            <PreviewFlexBox>
                                                <FlexBox>
                                                    <PreViewBox>전체</PreViewBox>
                                                    <TitleText>{inputText}</TitleText>
                                                </FlexBox>
                                                <DDayText>
                                                    {calculateDateDifference(selectedTime)}
                                                </DDayText>
                                            </PreviewFlexBox>
                                            <AboutText>
                                                일시 :{" "}
                                                {
                                                    selectedTime && !isNaN(selectedTime.getTime())
                                                        ? (format(selectedTime, "M월 d일 EEEE HH:mm", {locale: koLocale}))
                                                        : ("유효하지 않은 시간")
                                                }
                                            </AboutText>
                                            <AboutText>장소 : {inputAbout}</AboutText>
                                        </PreView>
                                    </ModalContents>
                                </ModalSubTitle>
                                {
                                    selectedSchedule?.scheduleId
                                        ?   <RegisterButton onClick={handleUpdateSchedule}>
                                                수정하기
                                            </RegisterButton>
                                        :   <RegisterButton $top={100} onClick={handleRegisterButtonClicked}>
                                                추가하기
                                            </RegisterButton>
                                }
                            </div>
                        )
                        : (
                            <div>
                                {/* 파트 선택하기 */}
                                <ModalSubTitle>
                                    <ModalContents color={"#111"} $right={81} $weight={500}>
                                        파트
                                    </ModalContents>
                                    <ModalContents>
                                        <DropdownWrapper>
                                            <DropdownButton onClick={toggleDropdown} color={selectedOption}>
                                                {selectedOption || "선택"}
                                                {
                                                    !isToggle
                                                        ? (<ArrowTop1 src={require("../Assets/img/PolygonDown.png")}/>)
                                                        : (
                                                            <ArrowTop1 src={require("../Assets/img/Polygon.png")}/>
                                                        )
                                                }
                                            </DropdownButton>
                                            <DropdownContent $isOpen={isToggle}>
                                                {
                                                    options.map((option, index) => (
                                                        <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
                                                            {option}
                                                        </DropdownItem>
                                                    ))
                                                }
                                            </DropdownContent>
                                        </DropdownWrapper>
                                    </ModalContents>
                                </ModalSubTitle>

                                {/* 과제 제목 작성하기 */}
                                <ModalSubTitle>
                                    <ModalContents color={"#111"} $right={46} $weight={500}>
                                        과제 제목
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <ReasonInput
                                            value={inputText || ""}
                                            onChange={handleInputChange}
                                            placeholder="과제 제목을 10자 이내로 작성해주세요."/>
                                        <InputNumNum>{
                                                inputText
                                                    ?.length
                                            }/10</InputNumNum>
                                    </ModalContents>
                                </ModalSubTitle>

                                {/* 과제 내용 작성하기 */}
                                <ModalSubTitle $top={54}>
                                    <ModalContents color={"#111"} $right={81} $weight={500}>
                                        내용
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <ReasonInput
                                            value={inputAbout || ""}
                                            onChange={handleAboutChange}
                                            placeholder="본문 내용을 20자 이내로 작성해주세요. "/>
                                        <InputNumNum>{
                                                inputAbout
                                                    ?.length
                                            }/20</InputNumNum>
                                    </ModalContents>
                                </ModalSubTitle>

                                {/* 제출 마감 날짜 선택하기 */}
                                <ModalSubTitle $top={53}>
                                    <ModalContents color={"#111"} $right={46} $weight={500}>
                                        제출 마감
                                    </ModalContents>
                                    <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                                        <DatePicker
                                            placeholderText="날짜를 선택하세요"
                                            className={style.datePicker}
                                            calendarClassName={style.calenderWrapper}
                                            selected={selectedTime}
                                            onChange={handleDateChange}
                                            showTimeSelect="showTimeSelect"
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            shouldCloseOnSelect={false}/>
                                    </ModalContents>
                                </ModalSubTitle>

                                {/* 추가하기 버튼 */}
                                {
                                    selectedSchedule?.scheduleId
                                        ?   <RegisterButton onClick={handleUpdateTask}>
                                                수정하기
                                            </RegisterButton>
                                        :   <RegisterButton onClick={handleRegisterTaskButtonClicked}>
                                                추가하기
                                            </RegisterButton>
                                }
                            </div>
                        )
                }
            </ModalContent>
        </ModalWrapper>
    );
};




const ScheduleTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
    `;


const BodyDiv = styled.div `
    display: flex;
    margin-top: 83px;
    margin-left: 80px;
    height: 744px;
    `;

const RightDiv = styled.div `
    width: 602px;
    height: 744px;
    margin-right: 40px;
    `;

const LeftDiv = styled.div `
    height: 744px;
    width: 602px;
    `;

const ScheduleDiv = styled.div `
    margin-top: 16px;
    height: 696px;
    overflow: scroll;
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
    margin-top: 24px;
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: space-between;
    `;

const PartNameDiv = styled.div `
    border-radius: 4px;
    border: 1px solid var(--black-background, #1a1a1a);
    background: ${props => props.$isPastEvent ? 'pink': 'var(--Gray30, #b0b0b0)'};
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
    margin-bottom: 8px;
    `;

const DelteButton = styled.button `
    width: 70px;
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
    margin-bottom: 10px;
    cursor: pointer;
`;

const DeleteIcon = styled.img `
    width: 18px;
    height: 16px;
    margin-right: 2px;
`;

const ContentText = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 12px;
    margin-left: 24px;
    margin-top: 8px;
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
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

const EditIcon = styled.img `
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;

const FirstDiv = styled.div `
    display: flex;
    height: 48px;
    width: 100%;
    margin-bottom: 16px;
    justify-content: space-between;
    align-items: flex-end;
`;

// 모달 관련 Style 코드
const ModalWrapper = styled.div `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: ${(props) => (props.$isOpen? "block": "none")};
`;

const ModalContent = styled.div `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 620px;
    height: 552px;
    background-color: white;
    `;

const ModalTitleDiv = styled.div `
    display: flex;
    margin-left: 56px;
    margin-top: 40px;
    margin-bottom: 48px;
    justify-content: space-between;
    align-items: flex-start;
    height: 36px;
    `;

const ModalTitle = styled.div `
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
    `;

const CancelIcon = styled.img `
    width: 36px;
    height: 36px;
    cursor: pointer;
    margin-right: 32px;
    `;

const ModalSubTitle = styled.div `
    height: 24px;
    display: flex;
    margin-left: 56px;
    align-items: center;
    margin-top: 41px;
    margin-top: ${(props) => props.$top || 41}px;
`;

const ModalContents = styled.div `
    color: ${ (props) => props.color};
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: ${(props) => props.$weight};
    line-height: 24px;
    margin-right: ${ (props) => props.$right}px;
    margin-top: ${(props) => props.$top}px;
`;

const DropdownWrapper = styled.div `
    position: relative;
    display: inline-block;
    margin-top: 0px;
    margin-left: 0px;
    display: flex;
    width: 130px;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
`;

const DropdownButton = styled.button `
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    background: ${ (props) => props.Backcolor};
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 8px;
    color: ${(props) => (props.color? "#1A1A1A": "#A3A3A3")};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ArrowTop1 = styled.img `
    width: 14px;
    height: 14px;
    margin-left: 16px;
    margin-bottom: 1px;
    cursor: pointer;
`;

const DropdownContent = styled.div `
    display: ${ (props) => (props.$isOpen? "block": "none")};
    position: absolute;
    background-color: #f1f1f1;
    min-width: 128.5px;
    z-index: 1;
    top: 100%;
    left: 0;
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

const ReasonInput = styled.input `
    width: 395px;
    height: 42px;
    border-radius: 4px;
    border: 1px solid var(--Gray10, #e4e4e4);
    background: var(--White, #fff);
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    padding-left: 20px;
    margin-top: 25px;
    color: var(--black-background, #1a1a1a);

    &::placeholder {
        color: var(--Gray30, #a3a3a3);
        padding-right: 20px;
    }
`;

const InputNumNum = styled.div `
    color: var(--Gray30, #a3a3a3);
    text-align: right;
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    margin-top: 16px;
    margin-top: 4px;
    `;

const RegisterButton = styled.button `
    width: 556px;
    height: 48px;
    margin-left: 32px;
    border-radius: 8px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--primary-blue, #5262f5);
    display: flex;
    width: 556px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: var(--primary-blue, white);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-top: ${(props) => props.top || 66}px;
    cursor: pointer;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`;

const PreView = styled.div `
    padding: 15px 18px;
    display: flex;
    flex-direction: column;
    width: 245px;
    height: 70px;
    border-radius: 6px;
    background: var(--black-card, #2a2a2a);
`;

const PreviewFlexBox = styled.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: auto;
    margin-bottom: 13px;
`;

const FlexBox = styled.div `
    display: flex;
    align-items: center;
    flex-direction: row;
`;

const AboutText = styled.div `
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
    margin-bottom: 7px;
    margin-left: 2px;
`;

const PreViewBox = styled.div `
    border-radius: 3px;
    border: 0.75px solid #5262f5;
    background: var(--grabp, linear-gradient(92deg, #5262f5 0%, #7b3fef 100%));
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 9px;
    font-style: normal;
    font-weight: 700;
    line-height: 10.5px;
    padding: 3px 9px;
    margin-right: 6px;
`;

const TitleText = styled.div `
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
`;

const DDayText = styled.div `
    color: var(--Gray10, #e4e4e4);
    font-family: "Pretendard";
    font-size: 9px;
    font-style: normal;
    font-weight: 600;
    line-height: 12px;
`;

const SubMessage = styled.div `
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
`;

const DeleteButton = styled.button `
    margin-left: 20px;
    padding : 5px 10px;
    box-sizing: border-box;
`;