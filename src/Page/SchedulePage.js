import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { collection, getDocs,addDoc, doc, deleteDoc, Timestamp, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime, differenceInDays } from "date-fns";
import koLocale from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from "../Styles/calendar.module.scss";

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
  /* width: 960px; */
  height: 744px;
  /* background-color: red; */
`;

const RightDiv = styled.div`
  width: 602px;
  height: 744px;
  margin-right: 40px;
  /* background-color: gray; */
`;

const LeftDiv = styled.div`
  height: 744px;
  width: 602px;
  /* background-color: blue; */
`;

const ScheduleDiv = styled.div`
  margin-top: 16px;
  height: 696px;
  overflow: scroll;
`;

const ScheduleItem = styled.div`
  width: 600px;
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
  margin-top: 24px;
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
  margin-bottom: 8px;
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
  cursor: pointer;
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

const EditButton = styled.button`
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

const EditIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const FirstDiv = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: flex-end;
`;

const SchedulePage = () => {
  const [schedules, setSchedule] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getDocs(collection(dbService, "schedules"));
        const newData = data.docs.map((doc) => ({ ...doc.data() }));
        setSchedule(newData);
        console.log(newData);
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
    const filteredSchedules = sortedSchedules.filter(
      (schedule) => schedule.type === true
    );
    return filteredSchedules;
  };

  const getRecenTask = () => {
    const sortedSchedules = [...schedules].sort(
      (a, b) => b.dueDate - a.dueDate
    );
    const filteredSchedules = sortedSchedules.filter(
      (schedule) => schedule.type === false
    );
    return filteredSchedules;
  };

  // 삭제 기능
  const handleDeleteSchedule = async (documentId) => {
    const userConfirmed = window.confirm("일정을 삭제하시겠습니까?");

    if (userConfirmed) {
      try {
        const scheduleRef = doc(dbService, "schedules", documentId);

        // 문서 삭제
        await deleteDoc(scheduleRef);

        // 삭제가 성공하면 화면을 새로고침
        window.location.reload();
        alert("일정이 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  // Modal

  const openModal = () => {
    setIsModalOpen(true);
    setIsRegisterModalOpen(true);
  };

  const openTaskModal = () => {
    setIsModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 배경을 어둡게 표시 */
    display: ${(props) => (props.isOpen ? "block" : "none")};
  `;

  const ModalContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 620px;
    height: 552px;
    background-color: white;
    /* background-color: red; */
  `;

  const ModalTitleDiv = styled.div`
    display: flex;
    margin-left: 56px;
    margin-top: 40px;
    margin-bottom: 48px;
    justify-content: space-between;
    align-items: flex-start;
    height: 36px;
  `;

  const ModalTitle = styled.div`
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px;
  `;

  const CancelIcon = styled.img`
    width: 36px;
    height: 36px;
    cursor: pointer;
    margin-right: 32px;
  `;

  const ModalSubTitle = styled.div`
    height: 24px;
    display: flex;
    margin-left: 56px;
    align-items: center;
    margin-top: 41px;
    margin-top: ${(props) => props.top || 41}px;
  `;

  const ModalContents = styled.div`
    color: ${(props) => props.color};
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: ${(props) => props.weight};
    line-height: 24px;
    margin-right: ${(props) => props.right}px;
    margin-top: ${(props) => props.top}px;
  `;

  const DropdownWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin-top: 0px;
    margin-left: 0px;
    display: flex;
    width: 130px;
    justify-content: center;
    align-items: center;
    /* gap: 24px; */
    border-radius: 2px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
  `;

  const DropdownButton = styled.button`
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    background: ${(props) => props.Backcolor};
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 8px;
    color: ${(props) => (props.color ? "#1A1A1A" : "#A3A3A3")};
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const ArrowTop1 = styled.img`
    width: 14px;
    height: 14px;
    margin-left: 16px;
    margin-bottom: 1px;
    cursor: pointer;
  `;

  const DropdownContent = styled.div`
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    z-index: 1;
    top: 100%;
    left: 0;
    border: 1px solid #ccc;
  `;

  const DropdownItem = styled.div`
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #ddd;
    }
  `;

  const ReasonInput = styled.input`
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

    &::placeholder {
      color: var(--Gray30, #a3a3a3);
      padding-right: 20px;
    }
  `;

  const InputNumNum = styled.div`
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

  const RegisterButton = styled.button`
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
    /* Head/H1-SB-18 */
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

  const PreView = styled.div`
    padding: 15px 18px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* align-items: center; */
    /* gap: 12px; */
    width: 245px;
    height: 70px;
    border-radius: 6px;
    background: var(--black-card, #2a2a2a);
    margin-top: 55px;
  `;

  const PreviewFlexBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: auto;
    /* background-color: red; */
    margin-bottom: 13px;
  `;

  const FlexBox = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
  `;

  const AboutText = styled.div`
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
    margin-bottom: 7px;
    margin-left: 2px;
  `;

  const PreViewBox = styled.div`
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

  const TitleText = styled.div`
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
  `;

  const DDayText = styled.div`
    color: var(--Gray10, #e4e4e4);
    font-family: "Pretendard";
    font-size: 9px;
    font-style: normal;
    font-weight: 600;
    line-height: 12px;
  `;

  const SubMessage = styled.div`
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
  `;

  const Modal = ({ isOpen, isRegisterModalOpen, onClose }) => {
    const [isToggle, setIsToggle] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputText, setInputText] = useState("");
    const [inputAbout, setInputAbout] = useState("");
    // 닐짜 코드
    const [selectedDate, setSelectedDate] = useState();
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false); 
    
    const handleDateChange = (date) => {
      setSelectedDate(date);
      setSelectedTime(date);
      if (selectedDate) {
        // 날짜와 시간이 모두 선택되었을 때 실행되는 로직
        setCalendarOpen(false);
      }
      console.log("선택 날짜 :", date);
    };

    // d-day 구하기
    function calculateDateDifference(selectedDateStr) {
      const today = new Date();

      const selectedDate = new Date(selectedDateStr);

      const daysDifference = differenceInDays(selectedDate, today);

      const formattedDifference =
        daysDifference === 0 ? "D-day" : `D-${Math.abs(daysDifference)}`;

      return formattedDifference;
    }

    // 파트 선택 코드
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
      const text = e.target.value;
      if (text.length <= 10) {
        setInputText(text);
      }
    };

    const handlePlaceChange = (e) => {
      const text = e.target.value;
      if (text.length <= 10) {
        setInputAbout(text);
      }
    };

    const handleAboutChange = (e) => {
      const text = e.target.value;
      if (text.length <= 20) {
        setInputAbout(text);
      }
    };

    const options = [
      "전체",
      "서버파트",
      "웹파트",
      "iOS파트",
      "디자인파트",
      "기획파트",
    ];

    // 일정 등록 코드 
    const handleRegisterButtonClicked = async () => {
      try {
        // selectedTime 값을 Timestamp로 변환 (Firestore에 저장할 수 있는 형식으로)
        const selectedTimeTimestamp = Timestamp.fromDate(selectedTime);
    
        // Firestore에 데이터를 추가하고, 반환된 문서의 ID를 받음
        const docRef = await addDoc(collection(dbService, "schedules"), {
          dueDate: selectedTimeTimestamp,
          type: true, 
          place: inputAbout,
          title: inputText,
          part: "전체",
        });
    
        // // 생성된 문서의 ID를 사용하여 "sid" 필드를 업데이트
        // await updateDoc(doc(doc(dbService, "schedules", docRef.id)), {
        //   sid: docRef.id,
        // });
    
        alert('일정이 추가되었습니다.');
        onClose();
        setTimeout(() => {
          window.location.reload(); // 페이지 새로고침
        }, 1000);
      } catch (error) {
        console.error('일정 추가 실패:', error);
        alert('일정 추가 중 오류가 발생했습니다.');
      }
    };
    

    return (
      <ModalWrapper isOpen={isOpen}>
        <ModalContent>
          <ModalTitleDiv>
            {isRegisterModalOpen ? (
              <ModalTitle>공식 일정 추가하기</ModalTitle>
            ) : (
              <ModalTitle>과제 추가</ModalTitle>
            )}
            <CancelIcon
              src={require("../Assets/img/CancelButton.png")}
              onClick={onClose}
            />
          </ModalTitleDiv>
          {isRegisterModalOpen ? (
            <>
              <ModalSubTitle>
                <ModalContents color={"#111"} right={46} weight={500}>
                  일정 제목
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <ReasonInput
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="일정 제목을 10자 이내로 작성해주세요."
                  />
                  <InputNumNum>{inputText.length}/10</InputNumNum>
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle top={54}>
                <ModalContents color={"#111"} right={81} weight={500}>
                  일시
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <DatePicker
                    placeholderText="날짜를 선택하세요"
                    className={style.datePicker}
                    calendarClassName={style.calenderWrapper}
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    shouldCloseOnSelect={false}
                  />
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle top={54}>
                <ModalContents color={"#111"} right={81} weight={500}>
                  장소
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <ReasonInput
                    value={inputAbout}
                    onChange={handlePlaceChange}
                    placeholder="일정 장소를 10자 이내로 작성해주세요."
                  />
                  <InputNumNum>{inputAbout.length}/10</InputNumNum>
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle top={50}>
                <ModalContents color={"#111"} right={46} weight={500}>
                  예시
                  <SubMessage>* 앱 노출 화면</SubMessage>
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
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
                      {format(selectedTime, "M월 d일 EEEE HH:mm", {
                        locale: koLocale,
                      })}
                    </AboutText>
                    <AboutText>장소 : {inputAbout}</AboutText>
                  </PreView>
                </ModalContents>
              </ModalSubTitle>
              <RegisterButton top={100} onClick={handleRegisterButtonClicked}>
추가하기</RegisterButton>
            </>
          ) : (
            <>
              <ModalSubTitle>
                <ModalContents color={"#111"} right={81} weight={500}>
                  파트
                </ModalContents>
                <ModalContents>
                  <DropdownWrapper>
                    <DropdownButton
                      onClick={toggleDropdown}
                      color={selectedOption}
                    >
                      {selectedOption || "전체"}
                      {!isToggle ? (
                        <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                      ) : (
                        <ArrowTop1
                          src={require("../Assets/img/PolygonDown.png")}
                        />
                      )}
                    </DropdownButton>
                    <DropdownContent isOpen={isToggle}>
                      {options.map((option, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </DropdownWrapper>
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle>
                <ModalContents color={"#111"} right={46} weight={500}>
                  일정 제목
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <ReasonInput
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="일정 제목을 10자 이내로 작성해주세요."
                  />
                  <InputNumNum>{inputText.length}/10</InputNumNum>
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle top={54}>
                <ModalContents color={"#111"} right={81} weight={500}>
                  내용
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <ReasonInput
                    value={inputAbout}
                    onChange={handleAboutChange}
                    placeholder="본문 내용을 20자 이내로 작성해주세요. "
                  />
                  <InputNumNum>{inputAbout.length}/20</InputNumNum>
                </ModalContents>
              </ModalSubTitle>
              <ModalSubTitle top={53}>
                <ModalContents color={"#111"} right={46} weight={500}>
                  제출 마감
                </ModalContents>
                <ModalContents color={"#A3A3A3"} right={0} weight={600}>
                  <DatePicker
                    placeholderText="날짜를 선택하세요"
                    className={style.datePicker}
                    calendarClassName={style.calenderWrapper}
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    shouldCloseOnSelect={false}
                  />
                </ModalContents>
              </ModalSubTitle>
              <RegisterButton>추가하기</RegisterButton>
            </>
          )}
        </ModalContent>
      </ModalWrapper>
    );
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
          <FirstDiv>
            <HomeTitle>공식 일정</HomeTitle>
            <EditButton onClick={openModal}>
              <EditIcon src={require("../Assets/img/ScheduleCIcon.png")} />
              공식 일정 추가하기
            </EditButton>
          </FirstDiv>
          <ScheduleDiv>
            {getRecentSchedules().map((schedule, index) => (
              <ScheduleItem key={index}>
                <ScheduleFirstDiv key={index}>
                  <FlextBoxDiv>
                    <PartNameDiv>{schedule.part}</PartNameDiv>
                    <DateDiv>{schedule.description}</DateDiv>
                  </FlextBoxDiv>
                  <DelteButton
                    onClick={() => handleDeleteSchedule(schedule.sid)}
                  >
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
          <FirstDiv>
            <HomeTitle>과제 일정</HomeTitle>
            <EditButton onClick={openTaskModal}>
              <EditIcon src={require("../Assets/img/ScheduleCIcon.png")} />
              과제 일정 추가하기
            </EditButton>
          </FirstDiv>
          <ScheduleDiv>
            {getRecenTask().map((schedule, index) => (
              <ScheduleItem key={index}>
                <ScheduleFirstDiv key={index}>
                  <FlextBoxDiv>
                    <PartNameDiv>{schedule.part}</PartNameDiv>
                    <DateDiv>{schedule.title}</DateDiv>
                  </FlextBoxDiv>
                  <DelteButton
                    onClick={() => handleDeleteSchedule(schedule.sid)}
                  >
                    <DeleteIcon src={require("../Assets/img/DeleteIcon.png")} />
                    삭제
                  </DelteButton>
                </ScheduleFirstDiv>
                <ContentText>{schedule.description}</ContentText>
                <ContentText>
                  마감 :{" "}
                  {format(
                    fromUnixTime(schedule.dueDate.seconds),
                    "M월 d일 EEEE HH:mm",
                    { locale: koLocale } // 한국어 로케일 설정
                  )}
                </ContentText>
              </ScheduleItem>
            ))}
          </ScheduleDiv>
        </LeftDiv>
      </BodyDiv>
      <Modal
        isOpen={isModalOpen}
        isRegisterModalOpen={isRegisterModalOpen}
        onClose={() => closeModal()}
      />
    </DDiv>
  );
};

export default SchedulePage;
