import styled from "styled-components";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { dbService } from "../fbase";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import React, { useEffect, useState } from "react";

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

const BodyDiv = styled.div`
  display: flex;
  /* margin-top: 16px; */
  margin-left: 80px;
  width: 1396px;
  height: 744px;
  overflow: scroll;
`;

const Table = styled.table`
  width: 1380px;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;
  overflow-x: scroll;
  overflow-y: scroll;
  /* background-color: red; */
`;

const TableHead = styled.thead`
  background-color: #eee;
  border-bottom: 1px solid #a3a3a3;
  /* overflow-x : scroll; */
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  display: flex;
`;

const TableHeaderCell = styled.th`
  color: var(--black-background, #1a1a1a);
  /* Body/B6-SB-16 */
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
  background: rgba(100, 197, 154, 0.1);

  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
`;

const TableCell = styled.td`
  color: ${(props) => props.color};
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

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 83px;
  margin-left: 80px;
  display: flex;
  width: 104px;
  justify-content: center;
  align-items: center;
  gap: 24px;
  border-radius: 2px;
  border: 1px solid var(--primary-blue, #5262f5);
  background: var(--White, #fff);
`;

const DropdownButton = styled.button`
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

const FirstDiv = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  margin-bottom: 16px;
  margin-top: 83px;
  justify-content: space-between;
  align-items: flex-end;
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
  padding: 12px 36px;
  cursor: pointer;
  margin-right: 60px;

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
  }
  &:active {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
  }
`;

const SaveButton = styled.button`
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
  margin-right: 60px;
  background: var(--primary-blue, #5262f5);
  border: none;

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

const CheckPage = () => {
  const [userDatas, setUserDatas] = useState([]);
  const [userAttendKey, setUserAttendKey] = useState([]);
  const [userAttendValue, setUserAttendValue] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [addable, setAddable] = useState(true);
  const [scheduleKeys, setScheduleKeys] = useState([]); // schedules의 sid 값들을 저장할 상태

  useEffect(() => {
    // Firestore에서 데이터 읽어오기
    const fetchSchedules = async () => {
      try {
        const schedulesRef = collection(dbService, "schedules");
        const querySnapshot = await getDocs(
          query(schedulesRef, where("type", "==", true))
        );

        const scheduleIds = [];
        querySnapshot.forEach((doc) => {
          scheduleIds.push(doc.id);
        });

        // dueDate 필드를 기준으로 데이터를 정렬 (과거 날짜가 먼저 오도록)
        scheduleIds.sort((a, b) => a.dueDate - b.dueDate);

        setScheduleKeys(scheduleIds); // 여기서 scheduleKeys 상태를 설정합니다.
        console.log('sid : ',scheduleIds)
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };


    const fetchData = async () => {
      const data = await getDocs(collection(dbService, "users")); // create라는 collection 안에 모든 document를 읽어올 때 사용한다.
      const newData = data.docs.map((doc) => ({ ...doc.data() }));

      const keys = [];
      const values = [];
      newData.forEach((item) => {
        const attend = item.attend || {}; // "attend"가 없을 경우 빈 객체로 초기화
        const itemKeys = Object.keys(attend);
        const itemValues = Object.values(attend);
        keys.push(itemKeys);
        values.push(itemValues);
      });

      setUserDatas(newData);
      setUserAttendKey(keys);
      setUserAttendValue(values);
      console.log(newData);
      console.log("key :", userAttendKey);
      console.log("value :", userAttendValue);
    };

    fetchData();
    fetchSchedules();
  }, []);

  // 정보 업데이트
  const updateFirestore = async () => {
    try {
      const batch = [];
      userDatas.forEach((userData) => {
        const userDocRef = doc(dbService, "users", userData.uid); // userId 필드가 있다고 가정
        const updatedAttendInfo = userData.attendInfo;
        batch.push(updateDoc(userDocRef, { attendInfo: updatedAttendInfo }));
      });

      await Promise.all(batch).then(() => {
        console.log("Firestore 문서 업데이트 성공!");
        alert("Firestore 문서 업데이트 성공!"); // 성공 시 알림 추가
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 1000); // Delay for 1 second (1000 milliseconds)
      });
    } catch (error) {
      console.error("Firestore 문서 업데이트 오류:", error);
    }
  };

  const handleEditButtonClick = () => {
    const confirmSave = window.confirm("변경 사항을 저장하시겠습니까?");
    if (confirmSave) {
      updateFirestore();
    }
  };

  // 필터 관련 코드
  const options = [
    "전체",
    "서버파트",
    "웹파트",
    "iOS파트",
    "디자인파트",
    "기획파트",
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (option === "전체") {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
    setIsOpen(false);
  };

  const sortedUserScores = userDatas
    .filter((user) => user.name) // name 속성이 정의된 요소만 필터링
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredUserScores = selectedOption
    ? sortedUserScores.filter((userScore) => userScore.part === selectedOption)
    : sortedUserScores;

  // 업데이트 관련 코드

const updateUser = async (index, idx, newData) => {
  const updatedUserDatas = [...userDatas];
  updatedUserDatas[index] = {
    ...updatedUserDatas[index],
    attendInfo: { ...updatedUserDatas[index].attendInfo, [idx]: newData },
  };
  setUserDatas(updatedUserDatas);

  // attend 맵 업데이트
  const updatedAttend = { ...updatedUserDatas[index].attend };
  updatedAttend[scheduleKeys[idx]] = newData; // scheduleKeys를 사용하여 업데이트
  updatedUserDatas[index].attend = updatedAttend;

  // Firestore에 업데이트
  const userDocRef = doc(dbService, "users", updatedUserDatas[index].uid);
  await updateDoc(userDocRef, {
    attendInfo: updatedUserDatas[index].attendInfo,
    attend: updatedAttend, // attend 맵 업데이트
  });

  console.log("Firestore 문서 업데이트 성공!");
};

  // 출석 결석 지각 버튼
  const AttendBox = styled.div`
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

  const AttendButton = styled.button`
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
    border: none;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    }
    &:active {
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25) inset;
    }
  `;

  const CustomTableCellContainer = styled.div`
    position: relative;
  `;

  const ImageContainer = styled.div`
    position: absolute;
    top: -60px; // 원하는 위치로 조정
    left: -80px; // 원하는 위치로 조정
    width: 200px;
    height: 60px;
    z-index: 1; // 다른 요소 위에 렌더링되도록 zIndex 설정
    /* 추가적인 스타일 설정 가능 */
  `;

  const Image = styled.img`
    width: 200px;
    height: 60px;
    object-fit: cover; // 이미지 크기 조정 방식 설정
  `;

  const ButtonFlexDiv = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -6%;
  `;

  const Button = styled.button`
    border: none;
    margin-right: ${(props) => props.right}px;
    margin-left: ${(props) => props.left}px;
    color: ${(props) => props.color};
    background-color: ${(props) => props.background};
    display: flex;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
  `;

  const CustomTableCell = ({ value, idx, onUpdate }) => {
    const [showButtons, setShowButtons] = useState(false);
    const [attendValue, setAttendValue] = useState(value[idx]);

    const toggleButtons = () => {
      setShowButtons(!showButtons);
    };

    const updateValue = (newValue) => {
      setAttendValue(newValue);
      setShowButtons(false);

      // 업데이트된 값을 부모 컴포넌트로 전달
      onUpdate(newValue);
    };

    let backgroundColor = "";
    let color = "";
    let displayValue = "";

    const sidValue = value[idx];

    switch (sidValue) {
      case "지":
        backgroundColor = "#FFE7D9";
        color = "var(--primary-orange, #FF5C00)";
        displayValue = "지각";
        break;
      case "출":
        backgroundColor = "#E8F6F0";
        color = "var(--primary-green, var(--primary-green, #64C59A))";
        displayValue = "출석";
        break;
      case "결":
        color = "var(--error-red, #FF5A5A)";
        backgroundColor = "#FFE6E6";
        displayValue = "결석";
        break;
      default:
        backgroundColor = "";
        color = "";
        displayValue = "  ";
    }

    return (
      <CustomTableCellContainer>
        {addable ? (
          <AttendBox style={{ backgroundColor, color }}>
            {displayValue}
          </AttendBox>
        ) : (
          <>
            <AttendButton
              onClick={toggleButtons}
              style={{ backgroundColor, color }}
            >
              {displayValue}
            </AttendButton>

            {showButtons && (
              <ImageContainer>
                <Image
                  src={require("../Assets/img/CheckEditBox.png")}
                  alt="Image Alt Text"
                />
                <ButtonFlexDiv>
                  <Button
                    color={"#64C59A"}
                    background={"#E8F6F0"}
                    onClick={() => updateValue("출")}
                  >
                    출석
                  </Button>
                  <Button
                    color={"#FF5C00"}
                    background={"#FFE7D9"}
                    left={8}
                    right={8}
                    onClick={() => updateValue("지")}
                  >
                    지각
                  </Button>
                  <Button
                    color={"#FF5A5A"}
                    background={"#FFE6E6"}
                    onClick={() => updateValue("결")}
                  >
                    결석
                  </Button>
                </ButtonFlexDiv>
              </ImageContainer>
            )}
          </>
        )}
      </CustomTableCellContainer>
    );
  };

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>출결 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 출결을 관리해보세요.</SubTitle>
      </TitleDiv>
      <FirstDiv>
        <DropdownWrapper>
          <DropdownButton onClick={toggleDropdown}>
            {selectedOption || "전체"}
          </DropdownButton>
          <DropdownContent isOpen={isOpen}>
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
        {addable ? (
          <EditButton onClick={() => setAddable(false)}>
            <EditIcon src={require("../Assets/img/EditIcon.png")} />
            수정하기
          </EditButton>
        ) : (
          <SaveButton onClick={handleEditButtonClick}>저장하기</SaveButton>
        )}
      </FirstDiv>
      {addable ? (
        <BodyDiv>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell width={140} style={{ background: "#F8F8F8" }}>
                  이름
                </TableHeaderCell>
                <TableHeaderCell width={152}>OT</TableHeaderCell>
                <TableHeaderCell width={152}>1차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>2차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>3차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>연합 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>4차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>5차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>6차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>
                  기디개 연합 세미나
                </TableHeaderCell>
                <TableHeaderCell width={152}>숏커톤</TableHeaderCell>
                <TableHeaderCell width={152}>아이디어 피칭</TableHeaderCell>
                <TableHeaderCell width={152}>종강총회</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredUserScores.map((userData, index) => (
                <TableRow key={index}>
                  <TableCell color={"#2A2A2A"} width={140}>
                    {userData.name}
                  </TableCell>
                  {Array.from({ length: 12 }, (_, idx) => (
                    <TableCell key={idx} width={152}>
                      <CustomTableCell value={userData.attendInfo} idx={idx} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </BodyDiv>
      ) : (
        <BodyDiv>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell width={140} style={{ background: "#F8F8F8" }}>
                  이름
                </TableHeaderCell>
                <TableHeaderCell width={152}>OT</TableHeaderCell>
                <TableHeaderCell width={152}>1차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>2차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>3차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>연합 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>4차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>5차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>6차 세미나</TableHeaderCell>
                <TableHeaderCell width={152}>
                  기디개 연합 세미나
                </TableHeaderCell>
                <TableHeaderCell width={152}>숏커톤</TableHeaderCell>
                <TableHeaderCell width={152}>아이디어 피칭</TableHeaderCell>
                <TableHeaderCell width={152}>종강총회</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredUserScores.map((userData, index) => (
                <TableRow key={index}>
                  <TableCell color={"#2A2A2A"} width={140}>
                    {userData.name}
                  </TableCell>
                  {Array.from({ length: 12 }, (_, idx) => (
                    <TableCell key={idx} width={152}>
                      <CustomTableCell
                        value={userData.attendInfo}
                        idx={idx}
                        addable={addable}
                        onUpdate={(newData) =>
                          updateUser(userDatas.indexOf(userData), idx, newData)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </BodyDiv>
      )}
    </DDiv>
  );
};

export default CheckPage;
