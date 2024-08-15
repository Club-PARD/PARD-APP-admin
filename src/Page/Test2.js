import React, { useEffect, useState } from "react";

import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";
import { fetchUsers } from "../Api/FireStore";
import { getAllUserData } from "../Api/UserAPI";

/* 
- Firebase fireStore User 데이터 조회
  - User 정보 조회 후 sort
  - 파트 구분
- 토글 코드 
  - 선택 관련 코드
- 사용자 추가 코드
  - 사용자 Firebass firestore에 등록
  - 취소 버튼
- 모달 관련 코드
  - 모달 관련 Style 코드
  - Modal 컴포넌트
  - user 정보 업데이트 코드
- Main 화면 코드
*/

const MemberPage = () => {
  const [userScores, setUserScores] = useState([]);
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
  const [isContentChanged, setContentChanged] = useState(false); // 컨텐츠 변경 확인 state

  // 변수 : User 정보 조회 후 sort
  const sortedUserScores = userScores
    .filter((userScore) => userScore.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  // 변수 : 파트 구분
  const filteredUserScores = sortedUserScores.filter((userScore) => {
    const memberFilter =
      selectedMemberFilter === "구분" ||
      selectedMemberFilter === "전체" ||
      userScore.member === selectedMemberFilter;
    const partFilter =
      selectedPartFilter === "전체" ||
      selectedPartFilter === "파트" ||
      userScore.part === selectedPartFilter;
    return memberFilter && partFilter;
  });

  // FIREBASE CODE
  // Firebase fireStore User 데이터 조회
  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUserData();
      setUserScores(users);
    };
    getUsers();
  }, []);



  // 토글 코드
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

  const part = ["기획파트", "디자인파트", "웹파트", "iOS파트", "서버파트"];
  const partFillter = [
    "전체",
    "기획파트",
    "디자인파트",
    "웹파트",
    "iOS파트",
    "서버파트",
  ];

  const toggleDropdown = (index) => {
    const updatedIsOpen = [...isOpen];
    updatedIsOpen[index] = !updatedIsOpen[index];
    setIsOpen(updatedIsOpen);
  };

  const handleMemberClick = (member, index) => {
    const updatedMembers = [...selectedMembers];
    updatedMembers[index] = member;
    setSelectedMembers(updatedMembers);
    const updatedIsOpen = [...isOpen];
    updatedIsOpen[index] = false;
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

  // 사용자 추가 코드
  const handleEditButtonClick = () => {
    const confirmSave = window.confirm("새로운 멤버를 추가하시겠습니까?");
    if (confirmSave) {
      handleAddButtonClick();
    }
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

  // 사용자 Firebass firestore에 등록
  const handleAddButtonClick = async () => {
    const promises = []; // 여러 비동기 작업을 동시에 처리하기 위한 프로미스 배열

    // 최대 처리할 횟수 : 15회
    for (let index = 0; index < 15; index++) {
      // 선택된 사용자 정보가 모두 유효한 경우만 처리
      if (
        selectedMembers[index] !== null &&
        selectedPart[index] !== null &&
        nameInputs[index] !== "" &&
        phoneInputs[index] !== ""
      ) {
        // 고유한 문서 ID 생성
        const uid = nameInputs[index] + Math.random().toString(36).substr(2, 5);
        const pid =nameInputs[index] + Math.random().toString(36).substr(2, 5);

        // 사용자 데이터를 준비
        const userData = {
          member: selectedMembers[index],
          part: selectedPart[index],
          name: nameInputs[index],
          phone: phoneInputs[index],
          isAdmin: selectedMembers[index] === "운영진",
          isMaster: selectedMembers[index] === "운영진",
          generation: 3,
          attend: {},
          attendInfo: [],
          uid: uid,
          pid: pid,
        };

        // 'users' 컬렉션 +  'points' 컬렉션에 추가할 문서 참조 생성
        const userDocRef = doc(dbService, "users", uid);
        const pointsDocRef = doc(dbService, "points", pid);

        // 사용자 문서를 'users' 컬렉션에 추가하고, 그 후 'points' 컬렉션에 포인트 문서를 추가하는 프로미스를 생성.
        const promise = setDoc(userDocRef, userData).then(() => {
          // 포인트 데이터를 준비합니다.
          const pointsData = {
            beePoints: [],
            points: [],
            pid: pid,
            uid: uid,
          };

          // 포인트 문서 'points' 컬렉션에 추가
          return setDoc(pointsDocRef, pointsData);
        });

        // 프로미스 배열 추가
        promises.push(promise);
      }
      // console.log(index);
    }

    try {
      await Promise.all(promises);
      setAddable(true); // 버튼 활성화
      // window.location.reload(); // 페이지 새로고침
      alert("등록 성공!"); // 사용자에게 성공 메시지 표시
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // 취소 버튼
  const handleCancelClick = () => {
    const confirmSave = window.confirm(
      "변경사항이 저장되지 않습니다.\n취소 하시겠습니까?"
    );
    if (confirmSave) {
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 1000);
    }
  };

  // 모달 관련 코드
  const [modals, setModals] = useState(
    new Array(filteredUserScores.length).fill(false)
  );

  const openModal = (index) => {
    const newModals = [...modals];
    newModals[index] = true;
    setModals(newModals);
  };

  const closeModal = (index) => {
    if (!isContentChanged) {  // 내용이 변경되지 않았을 때의 처리
      const newModals = [...modals];
      newModals[index] = false;
      setModals(newModals);
      return;
    }
    const result = window.confirm("변경사항을 저장하지 않고 나가시겠습니까?");
    if (result) {
      const newModals = [...modals];
      newModals[index] = false;
      setModals(newModals);
    }
  };

  const closeModalUpdate = (index) => {
    const newModals = [...modals];
    newModals[index] = false;
    setModals(newModals);
  };

  // 모달 관련 Style 코드
  const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: ${(props) => (props.isModalOpen ? "block" : "none")};
  `;

  const ModalContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 620px;
    height: 640px;
    background-color: white;
  `;

  const ModalTitleDiv = styled.div`
    display: flex;
    margin-left: 56px;
    margin-top: 40px;
    margin-bottom: 40px;
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
    margin-top: 24px;
    margin-top: ${(props) => props.top || 46}px;
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

  const Input = styled.input`
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
    color: var(--black-background, #1a1a1a);

    &::placeholder {
      color: var(--Gray30, #a3a3a3);
      padding-right: 20px;
    }
  `;
  const UpdateButton = styled.button`
    width: 556px;
    height: 48px;
    margin-left: 32px;
    border-radius: 8px;
    background: var(--primary-blue, #5262f5);
    display: flex;
    width: 556px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: var(--White, #fff);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-top: 66px;
    border: none;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    background: ${(props) => (props.disabled ? "#A3A3A3" : "#5262f5")};
    &:hover {
      box-shadow: ${(props) =>
        props.disabled ? "none" : "0px 4px 8px 0px #5262f5"};
    }

    &:active {
      box-shadow: ${(props) =>
        props.disabled ? "none" : "0px 4px 8px 0px #5262f5 inset"};
    }
  `;

  const DropdownWrapperModal = styled.div`
    position: relative;
    display: inline-block;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 24px;
    width: 125px;
    border-radius: 2px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
  `;

  const DropdownButtonModal = styled.button`
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
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--black-background, #1a1a1a);
  `;

  const DropdownContentModal = styled.div`
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: absolute;
    background-color: #f1f1f1;
    width: 125px;
    z-index: 1;
    top: 100%;
    border-radius: 2px 2px 0px 0px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
    margin-top: 5px;
  `;

  const DropdownItemModal = styled.div`
    padding: 10px;
    cursor: pointer;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    border: 0.5px solid var(--primary-blue, #5262f5);
    text-align: center;
    &:hover {
      background: var(--primary-blue-10, #eeeffe);
    }
  `;

  // Modal 컴포넌트
  const Modal = ({
    isModalOpen,
    onModalClose,
    closeModalUpdate,
    name,
    part,
    uid,
    Num,
    level,
    pid,
    geneartion
  }) => {
    const [inputName, setInputName] = useState(name);
    const [inputPhoneNum, setInputPhoneNum] = useState(Num);
    const [selectedOption, setSelectedOption] = useState(part);
    const [selectedLevelOption, setSelectedLevelOption] = useState(level);
    const [toggleToPart, setToggleToPart] = useState(false);
    const [toggleToLevel, setToggleToLever] = useState(false);
    const [isEditm, setIsEdit] = useState(false);
    const [inputGeneration, setInputGeneartion] = useState(geneartion);

    const [isDeleteUser, setIsDeleteUser] = useState(false);
    const [isDeleteUserModal, setIsDeleteUserModal] = useState(false)

    const handleDeleteUserCancle = () => {
      setIsDeleteUser(false);
    };

    const handleDeleteUserConfirm = () => {
      // 여기서 사용자 정보를 삭제하는 작업을 수행합니다.
      setIsDeleteUser(false);
    };

    const handleNameChange = (e) => {
      const text = e.target.value;
      setIsEdit(true);
      if (text.length <= 10) {
        setInputName(text);
        setContentChanged(true); // 정보 수정이 되었으므로 true로 설정
      }
    };

    const handlePhoneNumChange = (e) => {
      setIsEdit(true);
      const text = e.target.value;
      if (text.length <= 20) {
        setInputPhoneNum(text);
        setContentChanged(true);  // 정보 수정이 되었으므로 true로 설정
      }
    };

    const handleGenerationChange = (e) => {
      const text = e.target.value;
      setInputGeneartion(text);
    }

    const PartOption = [
      "서버파트",
      "웹파트",
      "iOS파트",
      "디자인파트",
      "기획파트",
    ];

    const LevelOption = ["파디", "운영진", "거친파도", "잔잔파도"];

    const handleOptionClick = (option) => {
      if (option === "전체") {
        setSelectedOption(null);
      } else {
        setIsEdit(true);
        setSelectedOption(option);
      }
      setToggleToPart(false);
    };

    const handleOptionLevelClick = (option) => {
      if (option === "전체") {
        setSelectedLevelOption(null);
      } else {
        setIsEdit(true);
        setSelectedLevelOption(option);
      }
      setToggleToLever(false);
    };

    const toggleDropdownPart = () => {
      setToggleToPart(!toggleToPart);
    };

    const toggleDropdownLevel = () => {
      setToggleToLever(!toggleToLevel);
    };

    // user 정보 업데이트 코드
    const handleUpdateButtonClick = async () => {
      const confirmUpdate = window.confirm("사용자 정보를 수정하시겠습니까?");

      if (confirmUpdate) {
        try {
          const updates = {
            name: inputName,
            phone: inputPhoneNum,
            part: selectedOption,
            member: selectedLevelOption,
          };

          if (selectedLevelOption === "운영진") {
            updates.isAdmin = true;
            updates.isMaster = true;
          }

          if (
            selectedLevelOption === "운영진" ||
            selectedLevelOption === "거친 파도" ||
            selectedLevelOption === "잔잔 파도"
          ) {
            updates.attend = {};
            updates.attendInfo = {};
          }

          const pointsQuery = query(
            collection(dbService, "points"),
            where("pid", "==", pid)
          );
          const pointsQuerySnapshot = await getDocs(pointsQuery);

          if (!pointsQuerySnapshot.empty) {
            const pointsDocRef = pointsQuerySnapshot.docs[0].ref;
            const pointsUpdates = {
              beePoints: [],
              pid: pid,
              points: [],
              uid: uid,
            };

            await updateDoc(pointsDocRef, pointsUpdates);
          }

          // Update the user document in Firestore
          const userDocRefUp = doc(dbService, "users", uid);
          await updateDoc(userDocRefUp, updates);

          alert("사용자 정보가 업데이트되었습니다.");
          closeModalUpdate();
          setContentChanged(false); // 정보 수정이 되었으므로 false로 초기화
          window.location.reload();
        } catch (error) {
          console.error("사용자 정보 업데이트 실패:", error);
          alert("사용자 정보 업데이트 중 오류가 발생했습니다.");
        }
      }

    };

    const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] = useState(false);

    const openDeleteConfirmModal = () => {
      setIsOpenDeleteConfirmModal(true);
    }
    const closeDeleteConfirmModal = () => {
      setIsOpenDeleteConfirmModal(false);
    }

    return (
      <ModalWrapper isModalOpen={isModalOpen}>
        <ModalContent>
          <ModalTitleDiv>
            <ModalTitle>사용자 정보 수정하기</ModalTitle>
            <CancelIcon
              src={require("../Assets/img/CancelButton.png")}
              onClick={onModalClose}
            />
          </ModalTitleDiv>{" "}
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              이름
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              <Input
                value={inputName}
                onChange={handleNameChange}
                placeholder="이름을 10자 이내로 작성해주세요."
              />
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={41} weight={500}>
              전화번호
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              <Input
                value={inputPhoneNum}
                onChange={handlePhoneNumChange}
                placeholder="전화번호를 10자 이내로 작성해주세요."
              />
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              기수
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              <Input
                value={inputGeneration}
                onChange={handleGenerationChange}
                placeholder="기수를 작성해주세요."
              />
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              구분
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              <DropdownWrapperModal>
                <DropdownButtonModal onClick={toggleDropdownLevel}>
                  {selectedLevelOption || level}
                  {!toggleToLevel ? (
                    <ArrowTop1 src={require("../Assets/img/PolygonDown.png")} />
                  ) : (
                    <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                  )}
                </DropdownButtonModal>
                <DropdownContentModal isOpen={toggleToLevel}>
                  {LevelOption.map((option, index) => (
                    <DropdownItemModal
                      key={index}
                      onClick={() => handleOptionLevelClick(option)}
                    >
                      {option}
                    </DropdownItemModal>
                  ))}
                </DropdownContentModal>
              </DropdownWrapperModal>
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              파트
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              <DropdownWrapperModal>
                <DropdownButtonModal onClick={toggleDropdownPart}>
                  {selectedOption || part}
                  {!toggleToPart ? (
                    <ArrowTop1 src={require("../Assets/img/PolygonDown.png")} />
                  ) : (
                    <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                  )}
                </DropdownButtonModal>
                <DropdownContentModal isOpen={toggleToPart}>
                  {PartOption.map((option, index) => (
                    <DropdownItemModal
                      key={index}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </DropdownItemModal>
                  ))}
                </DropdownContentModal>
              </DropdownWrapperModal>
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={70} weight={500}>
              삭제
            </ModalContents>
            <ModalContents>
              <CheckScoreButton width = '140'onClick={openDeleteConfirmModal}>
                <Img src={require("../Assets/img/DeleteIconBlue.png")} style={{ width: "20px" }} />
                <Span>삭제하기</Span>
              </CheckScoreButton>
            </ModalContents>
            {
              isOpenDeleteConfirmModal && (
                <DeleteConfirmModal closeModal={closeDeleteConfirmModal} uid={uid} />
              )
            }
          </ModalSubTitle>
          <UpdateButton disabled={!isEditm} onClick={handleUpdateButtonClick}>
            저장하기
          </UpdateButton>
        </ModalContent>
        
      </ModalWrapper>
    );
  };

   const handleChangeRoleName = (role) => {
      switch (role) {
        case "ROLE_ADMIN":
          return "운영진";
          break;
        case "ROLE_YB":
          return "YB";
          break;
        case "ROLE_OB":
          return "OB";
          break;
      
        default:
          break;
      }
    }

  // Main 화면 코드
  return (
    <DDiv>
      <CommonLogSection />
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
          <TableDiv>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell width={60} style={{ background: "#F8F8F8" }}>
                    No.
                  </TableHeaderCell>
                  <TableHeaderCell
                    style={{ background: "#F8F8F8" }}
                    width={80}
                  >
                    기수
                  </TableHeaderCell>
                  <TableHeaderCell
                    width={120}
                    style={{ background: "#F8F8F8" }}
                  >
                    이름
                  </TableHeaderCell>
                  <TableHeaderCell
                    style={{ background: "#F8F8F8" }}
                    width={180}
                  >
                    이메일
                  </TableHeaderCell>
                  <TableHeaderCell
                    style={{ background: "#F8F8F8" }}
                    width={180}
                  >
                    전화번호
                  </TableHeaderCell>

                  <TableHeaderCell
                    style={{ background: "#F8F8F8" }}
                    width={180}
                  >
                    <DropdownWrapper>
                      <DropdownButton
                        onClick={handleArrowTopClick}
                        color={true}
                        Backcolor={"#F8F8F8"}
                      >
                        {selectedMemberFilter || "구분"}
                        {!isDropdownOpen ? (
                          <ArrowTop1
                            src={require("../Assets/img/PolygonDown.png")}
                          />
                        ) : (
                          <ArrowTop1
                            src={require("../Assets/img/Polygon.png")}
                          />
                        )}
                      </DropdownButton>
                      <DropdownContent
                        isOpen={isDropdownOpen}
                        left={-5}
                        width={145}
                      >
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
                  <TableHeaderCell
                    width={151}
                    style={{ background: "#F8F8F8" }}
                  >
                    <DropdownWrapper>
                      <DropdownButton
                        onClick={handleArrowPartClick}
                        color={true}
                        Backcolor={"#F8F8F8"}
                      >
                        {selectedPartFilter || "파트"}
                        {!isdropdownPart ? (
                          <ArrowTop1
                            src={require("../Assets/img/PolygonDown.png")}
                          />
                        ) : (
                          <ArrowTop1
                            src={require("../Assets/img/Polygon.png")}
                          />
                        )}
                      </DropdownButton>
                      <DropdownContent
                        isOpen={isdropdownPart}
                        left={-7}
                        width={120}
                      >
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
                  <TableHeaderCell
                    width={166}
                    style={{ background: "#F8F8F8" }}
                  >
                    관리
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUserScores.map((userInfo, index) => (
                  <TableRow key={index}>
                    <TableCell color={"#2A2A2A"} width={60}>
                      {index + 1}
                    </TableCell>
                    <TableMinText color={"#2A2A2A"} width={80}>
                      {userInfo.generation}기
                    </TableMinText>
                    <TableCell color={"#2A2A2A"} width={120}>
                      {userInfo.name}
                    </TableCell>
                    <TableMinText color={"#2A2A2A"} width={180}>
                      {userInfo.email}
                    </TableMinText>
                    <TableCell color={"#2A2A2A"} width={180}>
                      {userInfo.phone}
                    </TableCell>
                    {/* <TableMinText color={"#2A2A2A"} width={180}>
                      {userInfo.lastLogin &&
                        format(
                          fromUnixTime(userScore.lastLogin.seconds),
                          "yyyy-MM-dd HH:mm:ss",
                          {
                            locale: koLocale,
                          }
                        )}
                    </TableMinText> */}
                    <TableCell color={"#2A2A2A"} width={171} right={10}>
                      {handleChangeRoleName(userInfo.role)}
                    </TableCell>
                    <TableCell color={"#2A2A2A"} width={142} right={10}>
                      {userInfo.part}
                    </TableCell>
                    <TableCell width={166}>
                      <CheckScoreButton onClick={() => openModal(index)}>
                        관리
                      </CheckScoreButton>
                    </TableCell>
                    <Modal
                      isModalOpen={modals[index]}
                      onModalClose={() => closeModal(index)}
                      closeModalUpdate={() => closeModalUpdate(index)}
                      name={userInfo.name}
                      part={userInfo.part}
                      uid={userInfo.uid}
                      Num={userInfo.phone}
                      level={userInfo.member}
                      pid={userInfo.pid}
                      generation = {userInfo.generation}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableDiv>
        </BodyDiv>
      ) : (
        <BodyAddDiv>
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
            <FlexDiv>
              <CancelButton onClick={handleCancelClick}>취소하기</CancelButton>
              <RegisterAddButton onClick={handleEditButtonClick}>
                추가하기
              </RegisterAddButton>
            </FlexDiv>
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
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={193}>
                  이메일
                </TableHeaderCell>
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={193}>
                  전화번호
                </TableHeaderCell>
                {/* <TableHeaderCell style={{ background: "#F8F8F8" }} width={195}>
                  최근 로그인
                </TableHeaderCell> */}
                <TableHeaderCell style={{ background: "#F8F8F8" }} width={195}>
                  구분
                </TableHeaderCell>
                <TableHeaderCell width={195} style={{ background: "#F8F8F8" }}>
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
                  <TableMinText color={"#2A2A2A"} width={193}>
                    -
                  </TableMinText>
                  <TableCell color={"#2A2A2A"} width={193}>
                    <PhoneNumInputBox
                      type="text"
                      placeholder="입력"
                      value={phoneInputs[index] || ""}
                      onChange={(e) => handlePhoneInputChange(e, index)}
                    />
                  </TableCell>
                  {/* <TableMinText color={"#2A2A2A"} width={195}>
                    -
                  </TableMinText> */}
                  <TableCell color={"#2A2A2A"} width={195}>
                    <DropdownWrapper>
                      <DropdownButton
                        onClick={() => toggleDropdown(index)}
                        color={selectedMembers[index] !== null}
                      >
                        {selectedMembers[index] || "선택"}
                      </DropdownButton>
                      <DropdownContent
                        isOpen={isOpen[index]}
                        left={-7}
                        width={160}
                        top={1}
                      >
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
                  <TableCell color={"#2A2A2A"} width={195}>
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
        </BodyAddDiv>
      )}
    </DDiv>
  );
};

export default MemberPage;

const DDiv = styled.div`
  background: #fff;
  margin: 0 auto;
  height: 100%;
  overflow-y: hidden;
`;

const TitleDiv = styled.div`
  display: flex;
  margin-top: 25px;
  margin-left: 80px;
  align-items: center;
`;

const HomeTitle = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const SubTitle = styled.div`
  color: var(--black-background, #1a1a1a);
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
  max-width: 1240px;
  width: 90%;
  height: 700px;
`;

const TableDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 1242px;
  height: 700px;
  overflow-y: scroll;
`;

const BodyAddDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 83px;
  margin-left: 80px;
  width: 77%;
  height: 744px;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const FirstDiv = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
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
  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
  }
  &:active {
    box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
  }
`;

const CancelButton = styled.button`
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

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;
`;

const TableHead = styled.thead`
  background-color: #eee;
  border-bottom: 1px solid #a3a3a3;
  position: sticky;
  top: 0;
`;

const TableBody = styled.tbody`
  display: block;
  max-height: calc(100% - 48px);
  overflow-y: auto;
  border-bottom: 0.5px solid var(--Gray30, #a3a3a3);
  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  display: flex;
`;

const TableHeaderCell = styled.th`
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
  background: #fff;

  &:first-child {
    border-left: 1px solid var(--Gray30, #a3a3a3);
    border-radius: 4px 0px 0px 0px;
  }

  &:last-child {
    border-radius: 0px 4px 0px 0px;
    border-right: 1px solid var(--Gray30, #a3a3a3);
  }
`;

const ArrowTop1 = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 16px;
  margin-bottom: 1px;
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
  padding-right: ${(props) => props.right}px;

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
  width: ${props => props.width || "140"}px;
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f1f1f1;
  min-width: ${(props) => props.width}px;
  z-index: 1;
  top: 100%;
  left: 22px;
  border-radius: 2px 2px 0px 0px;
  background: var(--White, #fff);
  border: 1px solid var(--primary-blue, #5262f5);
  margin-top: ${(props) => props.top || 5}px;
  margin-left: ${(props) => props.left}px;
`;

const DropdownItem = styled.div`
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
  margin-top: 1px;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid var(--primary-blue, #5262f5);
  background: var(--White, #fff);
`;

const DropdownItem1 = styled.div`
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

const DeleteUserButton = styled.div`
  width: 124px;
  height : 40px;

  border-radius: 8px;
  border : 1px solid #5262F5;

  background-color: #5262F510;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover{
    background-color: #5262F550;
  }
`

const Img = styled.img`
  width: ${props => props.width};
  height : ${props => props.height};
`

const Span = styled.span`
  margin-top: 3px;
  margin-left: 5px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px; 

  color : #5262F5;
`

const DeleteConfirmModal = ({ closeModal, uid }) => {

  const handleDeleteUser = async () => {
    // delete the user document in Firestore
    try {
      const userDocRefUp = doc(dbService, "users", uid);
      await deleteDoc(userDocRefUp);

      alert("사용자가 삭제되었습니다.");
      window.location.reload();
      closeModal();
    } catch (error){
      console.error("Error deleting user : ", error)
    }

  }
  const ContainerDeleteConfirmModal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 424px;
    height : 150px;
    border-radius: 4px;

    border : 1px solid black;

    background-color: #fefefe;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;
  
  const ContainerContent = styled.span`
    width : 80%;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
  
    margin-top: 10px;
    margin-bottom: 15px;
  `

  const ContainerBottom = styled.div`
    width : 80%;
    display: flex;
    justify-content: end;
  `

  const Button = styled.span`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    &:first-child {
      margin-right: 30px;
    }

    &:hover{
      color : #5262F5;
    }
  `
  return (
    <ContainerDeleteConfirmModal>
      <ContainerContent>
        사용자 정보를 삭제하시겠습니까?<br/>삭제 후 정보가 복구되지 않습니다.
      </ContainerContent>
      <ContainerBottom>
        <Button onClick={closeModal}>취소</Button>
        <Button onClick={handleDeleteUser}>확인</Button>
      </ContainerBottom>
    </ContainerDeleteConfirmModal>
  );
}