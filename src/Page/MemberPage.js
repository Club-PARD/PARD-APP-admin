import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";

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
  flex-direction: column;
  margin-top: 83px;
  margin-left: 80px;
  width: 1340px;
  height: 744px;
  /* background-color: red; */
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const FirstDiv = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  /* background-color: green; */
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: flex-end;
`;

const MemberNumText = styled.div`
  color: ${(props) => props.color};
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-right: ${(props) => props.right}px;
`;

const RegisterMemberIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const RegisterButton = styled.button`
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

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
  }
  &:active {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
  }
`;

const RegisterAddButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 8px;
  background: #5262f5;
  color: #fff;
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  padding: 12px 65px;
  cursor: pointer;
  border: none;
  margin-right: 183px;
`;

const Table = styled.table`
  width: 1100px;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;
  /* background-color: red; */
`;

const TableHead = styled.thead`
  background-color: #eee;
  border-bottom: 1px solid #a3a3a3;
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
  background: #fff;

  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
`;

const ArrowTop = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 16px;
  cursor: pointer;
`;

const ArrowTop1 = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 16px;
  cursor: pointer;
`;

const TableCell = styled.td`
  color: ${(props) => props.color};
  font-family: "Pretendard";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  height: auto;
  border-right: 0.5px solid var(--Gray30, #a3a3a3);
  border-left: 0.5px solid var(--Gray30, #a3a3a3);

  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
  background-color: #fff;
`;

const TableMinText = styled.td`
  color: ${(props) => props.color};
  font-family: "Pretendard";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  width: ${(props) => props.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  height: auto;
  border-right: 0.5px solid var(--Gray30, #a3a3a3);
  border-left: 0.5px solid var(--Gray30, #a3a3a3);

  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
  background-color: #fff;
`;

const CheckScoreButton = styled.button`
  display: flex;
  width: 140px;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: var(--primary-blue, #5262f5);
  font-family: "Pretendard";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  border-radius: 4px;
  border: 1px solid var(--primary-blue, #5262f5);
  background: var(--primary-blue-10, #eeeffe);
  cursor: pointer;

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
  }
  &:active {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
  }
`;

const NameInputBox = styled.input`
  width: 100%;
  height: 100%;
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  ::placeholder {
    text-align: center;
  }
`;

const PhoneNumInputBox = styled.input`
  width: 100%;
  height: 100%;
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* padding-left: 75px; */
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  text-align: center;
  ::placeholder {
    text-align: center;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 24px;
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
  padding: 8px 12px;
  color: ${(props) => (props.color ? "#1A1A1A" : "#A3A3A3")};
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f1f1f1;
  min-width: 145px;
  z-index: 1;
  top: 100%;
  left: 22px;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid var(--primary-blue, #5262f5);
  background: var(--White, #fff);
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const DropdownWrapper1 = styled.div`
  position: relative;
  display: inline-block;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: var(--White, #fff);
`;

const DropdownButton1 = styled.button`
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
  color: ${(props) => (props.color ? "#1A1A1A" : "#A3A3A3")};
`;

const DropdownContent1 = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f1f1f1;
  min-width: 145px;
  z-index: 1;
  top: 100%;
  left: 22px;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid var(--primary-blue, #5262f5);
  background: var(--White, #fff);
`;

const DropdownItem1 = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const MemberPage = () => {
  const [userScores, setUserScores] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [addable, setAddable] = useState(true);
  const [isOpen, setIsOpen] = useState(Array(15).fill(false));
  const [isOpenPart, setIsOpenPart] = useState(Array(15).fill(false));
  const [selectedMembers, setSelectedMembers] = useState(Array(15).fill(null));
  const [selectedPart, setSelectedPart] = useState(Array(15).fill(null));
  const [nameInputs, setNameInputs] = useState(Array(15).fill(""));
  const [phoneInputs, setPhoneInputs] = useState(Array(15).fill(""));
  const [selectedMemberFilter, setSelectedMemberFilter] = useState("구분");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPartFilter, setSelectedPartFilter] = useState("파트");
  const [isdropdownPart, setIsdropdownPart] = useState(false);

  // User 정보 읽기

  const sortedUserScores = userScores.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });


// 필터
const filteredUserScores = sortedUserScores.filter((userScore) => {
  const memberFilter =
    selectedMemberFilter === "전체" || userScore.member === selectedMemberFilter;
  const partFilter =
    selectedPartFilter === "파트" || userScore.part === selectedPartFilter;
  return memberFilter && partFilter;
});

  const fetchUsers = async () => {
    const usersRef = collection(dbService, "users");
    const querySnapshot = await getDocs(usersRef);
    const usersData = [];

    querySnapshot.forEach((doc) => {
      usersData.push(doc.data());
    });

    setUserScores(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  // 구분 필터
  const handleArrowTopClick = () => {
    // Dropdown 열고 닫기 토글
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMemberItemClick = (memberOption) => {
    // 멤버를 선택하고 Dropdown 닫기
    handleArrowTopClick();
    setSelectedMemberFilter(memberOption);
  };


  const handleArrowPartClick = () => {
    // 파트 열고 닫기 토글
    setIsdropdownPart(!isdropdownPart);
  };

  const handlePartItemClick = (memberOption) => {
    // 멤버를 선택하고 Dropdown 닫기
    handleArrowPartClick();
    setSelectedPartFilter(memberOption);
  };
  
  

  // 선택 관련 코드
  const member = ["파디", "거친파도", "운영진", "잔잔파도"];
  const memberFillter = ["전체", "파디", "거친파도", "운영진", "잔잔파도"];
  

  const part = ["기획", "디자인", "개발 - 웹", "개발 - iOS", "개발 - 서버"];
  const partFillter = ["기획", "디자인", "개발 - 웹", "개발 - iOS", "개발 - 서버"];

  const toggleDropdown = (index) => {
    const updatedIsOpen = [...isOpen];
    updatedIsOpen[index] = !updatedIsOpen[index]; // 선택한 인덱스의 Dropdown 열림 상태를 반전
    setIsOpen(updatedIsOpen);
    setSelectedOption(index); // 선택한 인덱스 설정
  };

  const handleMemberClick = (member, index) => {
    const updatedMembers = [...selectedMembers];
    updatedMembers[index] = member;
    setSelectedMembers(updatedMembers);
    const updatedIsOpen = [...isOpen];
    updatedIsOpen[index] = false; // 선택한 인덱스의 Dropdown 닫힘 상태로 설정
    setIsOpen(updatedIsOpen);
  };

  const handlePartClick = (partOption, index) => {
    setSelectedPart((prevSelectedPart) => {
      const updatedSelectedPart = [...prevSelectedPart];
      updatedSelectedPart[index] = partOption;
      return updatedSelectedPart;
    });

    setIsOpenPart((prevIsOpenPart) => {
      const updatedIsOpenPart = [...prevIsOpenPart];
      updatedIsOpenPart[index] = false;
      return updatedIsOpenPart;
    });
  };

  const toggleDropdownPart = (index) => {
    setIsOpenPart((prevIsOpenPart) => {
      const updatedIsOpenPart = [...prevIsOpenPart];
      updatedIsOpenPart[index] = !updatedIsOpenPart[index];
      return updatedIsOpenPart;
    });
  };

  // input 값 관리 코드
  const handleNameInputChange = (e, index) => {
    const updatedNameInputs = [...nameInputs];
    updatedNameInputs[index] = e.target.value;
    setNameInputs(updatedNameInputs);
  };

  const handlePhoneInputChange = (e, index) => {
    const updatedPhoneInputs = [...phoneInputs];
    updatedPhoneInputs[index] = e.target.value;
    setPhoneInputs(updatedPhoneInputs);
  };

  // 사용자 추가 코드

  const userCollectionRef = collection(dbService, "users");
  const pointsCollectionRef = collection(dbService, "points");

  const handleAddButtonClick = async () => {
    // 루프를 사용하여 각 인덱스에 대한 데이터 확인
    for (let index = 0; index < 15; index++) {
      if (
        selectedMembers[index] !== null &&
        selectedPart[index] !== null &&
        nameInputs[index] !== "" &&
        phoneInputs[index] !== ""
      ) {
        // 선택한 index에 해당하는 데이터가 모두 존재하는 경우에만 Firestore에 추가
        const userData = {
          member: selectedMembers[index],
          part: selectedPart[index],
          name: nameInputs[index],
          phone: phoneInputs[index],
          isAdmin: selectedMembers[index] === "운영진",
          isMaster: selectedMembers[index] === "운영진",
          generation: 2,
        };

        try {
          // Firestore에 데이터 추가
          const docRef = await addDoc(userCollectionRef, userData);
          console.log("Document written with ID: ", docRef.id);

          // Firestore 문서 업데이트
          const pointsData = {
            beePoints: [],
            points: [],
          };

          const docRefPoint = await addDoc(pointsCollectionRef, pointsData);

          const updatedUserData = {
            uid: docRef.id,
            pid: `${docRefPoint.id}`,
          };

          // Firestore 문서 업데이트
          await updateDoc(doc(userCollectionRef, docRef.id), updatedUserData);
          await updateDoc(
            doc(pointsCollectionRef, docRefPoint.id),
            updatedUserData
          );

          // 데이터 추가 완료 후 처리
          setAddable(true);
          alert("등록 성공!");
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    }
  };

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>회원관리 - 사용자 관리</HomeTitle>
        <BarText />
        <SubTitle>사용자를 추가하고 관리해보세요.</SubTitle>
      </TitleDiv>
      {addable ? (
        <BodyDiv>
          <FirstDiv>
            <FlexDiv>
              <MemberNumText color={"#1A1A1A"} right={4}>
                총
              </MemberNumText>
              <MemberNumText color={"#5262F5"}>
                {filteredUserScores.length}
              </MemberNumText>
              <MemberNumText color={"#1A1A1A"}>명</MemberNumText>
            </FlexDiv>
            <RegisterButton onClick={() => setAddable(false)}>
              <RegisterMemberIcon
                src={require("../Assets/img/MemberIcon.png")}
              />
              사용자 추가
            </RegisterButton>
          </FirstDiv>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell width={60} style={{ background: "#F8F8F8" }}>
                  No.
                </TableHeaderCell>
                <TableHeaderCell width={120} style={{ background: "#F8F8F8" }}>
                  이름
                </TableHeaderCell>
                <TableHeaderCell
                  style={{ background: "#F8F8F8" }}
                  width={197.5}
                >
                  이메일
                </TableHeaderCell>
                <TableHeaderCell
                  style={{ background: "#F8F8F8" }}
                  width={197.5}
                >
                  전화번호
                </TableHeaderCell>
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={190}>
                  최근 로그인
                </TableHeaderCell>
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={190}>
                  <DropdownWrapper>
                    <DropdownButton
                      onClick={handleArrowTopClick}
                      color={true}
                      Backcolor={"#F8F8F8"}
                    >
                      {selectedMemberFilter || "구분"}
                      <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                    </DropdownButton>
                    <DropdownContent isOpen={isDropdownOpen}>
                      {memberFillter.map((memberOption, memberIndex) => (
                        <DropdownItem
                          key={memberIndex}
                          onClick={() => handleMemberItemClick(memberOption)}
                        >
                          {memberOption}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </DropdownWrapper>
                </TableHeaderCell>
                <TableHeaderCell width={180} style={{ background: "#F8F8F8" }}>
                <DropdownWrapper>
                    <DropdownButton
                      onClick={handleArrowPartClick}
                      color={true}
                      Backcolor={"#F8F8F8"}
                    >
                      {selectedPartFilter || "파트"}
                      <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                    </DropdownButton>
                    <DropdownContent isOpen={isdropdownPart}>
                      {partFillter.map((memberOption, memberIndex) => (
                        <DropdownItem
                          key={memberIndex}
                          onClick={() => handlePartItemClick(memberOption)}
                        >
                          {memberOption}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </DropdownWrapper>
                </TableHeaderCell>
                <TableHeaderCell width={180} style={{ background: "#F8F8F8" }}>
                  관리
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredUserScores.map((userScore, index) => (
                <TableRow key={index}>
                  <TableCell color={"#2A2A2A"} width={60}>
                    {index + 1}
                  </TableCell>
                  <TableCell color={"#2A2A2A"} width={120}>
                    {userScore.name}
                  </TableCell>
                  <TableMinText color={"#2A2A2A"} width={197.5}>
                    {userScore.emali}
                  </TableMinText>
                  <TableCell color={"#2A2A2A"} width={197.5}>
                    {userScore.phone}
                  </TableCell>
                  <TableMinText color={"#2A2A2A"} width={190}>
                    {userScore.lastLogin &&
                      format(
                        fromUnixTime(userScore.lastLogin.seconds),
                        "yyyy-MM-dd HH:mm:ss",
                        {
                          locale: koLocale,
                        }
                      )}
                  </TableMinText>
                  <TableCell color={"#2A2A2A"} width={190}>
                    {userScore.member}
                  </TableCell>
                  <TableCell color={"#2A2A2A"} width={180}>
                    {userScore.part}
                  </TableCell>
                  <TableCell width={180}>
                    <CheckScoreButton>관리</CheckScoreButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </BodyDiv>
      ) : (
        <BodyDiv>
          <FirstDiv>
            <FlexDiv>
              <MemberNumText color={"#1A1A1A"} right={4}>
                총
              </MemberNumText>
              <MemberNumText color={"#5262F5"}>
                {filteredUserScores.length}
              </MemberNumText>
              <MemberNumText color={"#1A1A1A"}>명</MemberNumText>
            </FlexDiv>
            <RegisterAddButton onClick={handleAddButtonClick}>
              추가하기
            </RegisterAddButton>
          </FirstDiv>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell width={60} style={{ background: "#F8F8F8" }}>
                  No.
                </TableHeaderCell>
                <TableHeaderCell width={120} style={{ background: "#F8F8F8" }}>
                  이름
                </TableHeaderCell>
                <TableHeaderCell
                  style={{ background: "#F8F8F8" }}
                  width={197.5}
                >
                  이메일
                </TableHeaderCell>
                <TableHeaderCell
                  style={{ background: "#F8F8F8" }}
                  width={197.5}
                >
                  전화번호
                </TableHeaderCell>
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={190}>
                  최근 로그인
                </TableHeaderCell>
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={190}>
                  구분
                </TableHeaderCell>
                <TableHeaderCell width={180} style={{ background: "#F8F8F8" }}>
                  파트
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {Array.from({ length: 15 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell color={"#2A2A2A"} width={60}>
                    {index + 1}
                  </TableCell>
                  <TableCell color={"#2A2A2A"} width={120}>
                    <NameInputBox
                      type="text"
                      placeholder="입력"
                      value={nameInputs[index] || ""}
                      onChange={(e) => handleNameInputChange(e, index)}
                    />
                  </TableCell>
                  <TableMinText color={"#2A2A2A"} width={197.5}>
                    -
                  </TableMinText>
                  <TableCell color={"#2A2A2A"} width={197.5}>
                    <PhoneNumInputBox
                      type="text"
                      placeholder="입력"
                      value={phoneInputs[index] || ""}
                      onChange={(e) => handlePhoneInputChange(e, index)}
                    />
                  </TableCell>
                  <TableMinText color={"#2A2A2A"} width={190}>
                    -
                  </TableMinText>
                  <TableCell color={"#2A2A2A"} width={190}>
                    <DropdownWrapper>
                      <DropdownButton
                        onClick={() => toggleDropdown(index)}
                        color={selectedMembers[index] !== null}
                      >
                        {selectedMembers[index] || "선택"}
                      </DropdownButton>
                      <DropdownContent isOpen={isOpen[index]}>
                        {" "}
                        {/* 인덱스에 따라 열림 상태 설정 */}
                        {member.map((memberOption, memberIndex) => (
                          <DropdownItem
                            key={memberIndex}
                            onClick={() =>
                              handleMemberClick(memberOption, index)
                            }
                          >
                            {memberOption}
                          </DropdownItem>
                        ))}
                      </DropdownContent>
                    </DropdownWrapper>
                  </TableCell>
                  <TableCell color={"#2A2A2A"} width={180}>
                    <DropdownWrapper1>
                      <DropdownButton1
                        onClick={() => toggleDropdownPart(index)}
                        color={selectedPart[index] !== null}
                      >
                        {selectedPart[index] || "선택"}
                      </DropdownButton1>
                      <DropdownContent1 isOpen={isOpenPart[index]}>
                        {part.map((partOption, partIndex) => (
                          <DropdownItem1
                            key={partIndex}
                            onClick={() => handlePartClick(partOption, index)}
                          >
                            {partOption}
                          </DropdownItem1>
                        ))}
                      </DropdownContent1>
                    </DropdownWrapper1>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </BodyDiv>
      )}
    </DDiv>
  );
};

export default MemberPage;
