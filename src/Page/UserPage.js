import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {deleteUserData, getAllUserData, postUserData} from "../Api/UserAPI";

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

const UserPage = () => {
    const [userDataList, setUserDataList] = useState([]);
    const [addable, setAddable] = useState(true);
    const [isOpen, setIsOpen] = useState(Array(15).fill(false));
    const [isOpenPart, setIsOpenPart] = useState(Array(15).fill(false));
    const [selectedMembers, setSelectedMembers] = useState(Array(15).fill(null));
    const [selectedPart, setSelectedPart] = useState(Array(15).fill(null));
    const [generationInputs, setGenerationInputs] = useState(Array(15).fill(""));
    const [nameInputs, setNameInputs] = useState(Array(15).fill(""));
    const [phoneInputs, setPhoneInputs] = useState(Array(15).fill(""));
    const [emailInputs, setEmailInputs] = useState(Array(15).fill(""));
    const [selectedMemberFilter, setSelectedMemberFilter] = useState("구분");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPartFilter, setSelectedPartFilter] = useState("파트");
    const [isdropdownPart, setIsdropdownPart] = useState(false);
    const [isContentChanged, setContentChanged] = useState(false); // 컨텐츠 변경 확인 state
    const [selectedGeneration, setSelectedGeneration] = useState(3);
    const [isDropDownGeneration, setIsDropDownGeneration] = useState(false);

    // 변수 : User 정보 조회 후 sort
    const sortedUserDataList = userDataList
        ? userDataList
            .sort((a, b) => {
                return a?.name?.localeCompare(b.name);
            })
        : [];

    // 변수 : 파트 구분
    const filteredUserDataList = sortedUserDataList.filter((userDataList) => {
        const memberFilter = selectedMemberFilter === "구분" || selectedMemberFilter === "ALL" || userDataList.role === selectedMemberFilter;
        const partFilter = selectedPartFilter === "전체" || selectedPartFilter === "파트" || userDataList.part === selectedPartFilter;
        return memberFilter && partFilter;
    });

    // FIREBASE CODE Firebase fireStore User 데이터 조회
    useEffect(() => {
        const getUsers = async () => {
            const users = await getAllUserData(selectedGeneration);
            setUserDataList(users);
        };
        getUsers();
    }, [selectedGeneration]);

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

    // 선택 관련 코드 const member = ["파디", "거친파도", "운영진", "잔잔파도"];
    const member = ["ROLE_YB", "ROLE_OB", "ROLE_ADMIN"];
    const memberFillter = ["ALL", "ROLE_YB", "ROLE_OB", "ROLE_ADMIN"];

    // const part = ["기획파트", "디자인파트", "웹파트", "iOS파트", "서버파트"];
    const part = ["기획파트", "디자인파트", "웹파트", "iOS파트", "서버파트"];
    const partFillter = [
        "전체",
        "기획파트",
        "디자인파트",
        "웹파트",
        "iOS파트",
        "서버파트"
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
    const handleGenerationInputChange = (e, index) => {
        const updatedGenerationInputs = [...generationInputs];
        updatedGenerationInputs[index] = e.target.value;
        setGenerationInputs(updatedGenerationInputs);
    };
    const handleNameInputChange = (e, index) => {
        const updatedNameInputs = [...nameInputs];
        updatedNameInputs[index] = e.target.value;
        setNameInputs(updatedNameInputs);
    };

    const handlePhoneInputChange = (e, index) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        const updatedPhoneInputs = [...phoneInputs];
        updatedPhoneInputs[index] = formattedPhoneNumber;
        setPhoneInputs(updatedPhoneInputs);
    };
    const handleEmailInputChange = (e, index) => {
        const updatedEmailInputs = [...emailInputs];
        updatedEmailInputs[index] = e.target.value;
        setEmailInputs(updatedEmailInputs);
    };

    const handleAddButtonClick = async () => {
        let addUserInfo = [];
        let missingFields = [];
        let invalidEmails = [];
        
        // 최대 처리할 횟수 : 15회
        for (let index = 0; index < 15; index++) {
            // 입력된 정보가 있는지 확인
            if (nameInputs[index] !== "" || phoneInputs[index] !== "" || emailInputs[index] !== "" || generationInputs[index] !== "" || selectedMembers[index] !== null || selectedPart[index] !== null) {
                let rowMissingFields = [];
                
                // 모든 필수 필드 확인
                if (nameInputs[index] === "") rowMissingFields.push("이름");
                if (emailInputs[index] === "") {
                    rowMissingFields.push("이메일");
                } else if (!isValidEmail(emailInputs[index])) {
                    invalidEmails.push(`${index + 1}번째 행`);
                }
                if (phoneInputs[index] === "") rowMissingFields.push("전화번호");
                if (generationInputs[index] === "") rowMissingFields.push("기수");
                if (selectedMembers[index] === null) rowMissingFields.push("구분");
                if (selectedPart[index] === null) rowMissingFields.push("파트");
                
                if (rowMissingFields.length > 0) {
                    missingFields.push(`${index + 1}번째 행: ${rowMissingFields.join(", ")}`);
                } else if (!invalidEmails.includes(`${index + 1}번째 행`)) {
                    const data = {
                        name: nameInputs[index],
                        email: emailInputs[index],
                        part: selectedPart[index],
                        generation: generationInputs[index],
                        phoneNumber: phoneInputs[index],
                        role: selectedMembers[index]
                    };
                    addUserInfo.push(data);
                }
            }
        }

        if (missingFields.length > 0 || invalidEmails.length > 0) {
            let errorMessage = "";
            if (missingFields.length > 0) {
                errorMessage += `다음 정보를 입력해주세요:\n${missingFields.join("\n")}\n\n`;
            }
            if (invalidEmails.length > 0) {
                errorMessage += `다음 행의 이메일 형식이 올바르지 않습니다:\n${invalidEmails.join(", ")}`;
            }
            alert(errorMessage);
            return;
        }

        if (addUserInfo.length === 0) {
            alert("추가할 사용자 정보가 없습니다.");
            return;
        }

        try {
            // Firestore에 addUserInfo를 추가하는 로직을 여기서 작성
            postUserData(addUserInfo);
            setAddable(true); // 버튼 활성화
            alert("등록 성공!"); // 사용자에게 성공 메시지 표시
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    // 취소 버튼
    const handleCancelClick = () => {
        const confirmSave = window.confirm("변경사항이 저장되지 않습니다.\n취소 하시겠습니까?");
        if (confirmSave) {
            setTimeout(() => {
                window
                    .location
                    .reload(); // Refresh the page
            }, 1000);
        }
    };

    // 모달 관련 코드
    const [modals, setModals] = useState(
        new Array(filteredUserDataList.length).fill(false)
    );

    const openModal = (index) => {
        const newModals = [...modals];
        newModals[index] = true;
        setModals(newModals);
    };

    const closeModal = (index) => {
        if (!isContentChanged) { // 내용이 변경되지 않았을 때의 처리
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

    // Modal 컴포넌트
    const Modal = ({
        isModalOpen,
        onModalClose,
        closeModalUpdate,
        name,
        part,
        uid,
        Num,
        userEmail,
        role,
        pid,
        generation
    }) => {
        const [inputName, setInputName] = useState(name);
        const [inputPhoneNum, setInputPhoneNum] = useState(Num);
        const [selectedOption, setSelectedOption] = useState(part);
        const [selectedRoleOption, setSelectedRoleOption] = useState(role);
        const [toggleToPart, setToggleToPart] = useState(false);
        const [toggleToRole, setToggleToRole] = useState(false);
        const [isEditm, setIsEdit] = useState(false);
        const [inputGeneration, setInputGeneartion] = useState(generation);

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
            const formattedPhoneNumber = formatPhoneNumber(e.target.value);
            setInputPhoneNum(formattedPhoneNumber);
            setContentChanged(true); // 정보 수정이 되었으므로 true로 설정
        };

        const handleGenerationChange = (e) => {

            setIsEdit(true);
            const text = e.target.value;
            if (text.length <= 20) {
                setInputGeneartion(text);
                setContentChanged(true); // 정보 수정이 되었으므로 true로 설정
            }
        }

        const PartOption = ["서버파트", "웹파트", "iOS파트", "디자인파트", "기획파트"];

        const RoleOption = ["ROLE_YB", "ROLE_OB", "ROLE_ADMIN"];

        const handleOptionClick = (option) => {
            if (option === "ALL") {
                setSelectedOption(null);
            } else {
                setIsEdit(true);
                setSelectedOption(option);
            }
            setToggleToPart(false);
        };

        const handleOptionRoleClick = (option) => {
            if (option === "ALL") {
                setSelectedRoleOption(null);
            } else {
                setIsEdit(true);
                setSelectedRoleOption(option);
            }
            setToggleToRole(false);
        };

        const toggleDropdownPart = () => {
            setToggleToPart(!toggleToPart);
        };

        const toggleDropdownRole = () => {
            setToggleToRole(!toggleToRole);
        };

        const isValidPhoneNumber = (phoneNumber) => {
            if (phoneNumber.length === 13)
                return true;
            else
                return false;
        };
        
        // user 정보 업데이트 코드
        const handleUpdateButtonClick = async () => {
            const confirmUpdate = window.confirm("사용자 정보를 수정하시겠습니까?");

            if (confirmUpdate) {
                if (!isValidPhoneNumber(inputPhoneNum)) {
                    alert("전화번호 길이가 알맞지 않습니다. (예: 010-1234-5678)");
                    return;
                }

                try {
                    const updatedUserInfo = {
                        name: inputName,
                        email: userEmail,
                        part: selectedOption,
                        phoneNumber: inputPhoneNum,
                        role: selectedRoleOption,
                        generation: inputGeneration
                    };
                    console.log(updatedUserInfo);
                    const response = await postUserData([updatedUserInfo]);
                    if (response) {
                        alert("사용자 정보가 업데이트되었습니다.");
                        closeModalUpdate();
                        setContentChanged(false); // 정보 수정이 되었으므로 false로 초기화
                        window.location.reload();
                    }
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
                            onClick={onModalClose}/>
                    </ModalTitleDiv>{" "}
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            이름
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <Input
                                value={inputName}
                                onChange={handleNameChange}
                                placeholder="이름을 10자 이내로 작성해주세요."/>
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={41} $weight={500}>
                            전화번호
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <Input
                                value={formatPhoneNumber(inputPhoneNum)}
                                onChange={handlePhoneNumChange}
                                placeholder="전화번호를 입력해주세요."
                                maxLength={13} // XXX-XXXX-XXXX 형식의 최대 길이
                            />
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            기수
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <Input
                                value={inputGeneration}
                                onChange={handleGenerationChange}
                                placeholder="기수를 작성해주세요."/>
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            구분
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <DropdownWrapperModal>
                                <DropdownButtonModal onClick={toggleDropdownRole}>
                                    {handleChangeRoleName(selectedRoleOption || role)}
                                    {
                                        !toggleToRole
                                            ? (<ArrowTop1 src={require("../Assets/img/PolygonDown.png")}/>)
                                            : (<ArrowTop1 src={require("../Assets/img/Polygon.png")}/>)
                                    }
                                </DropdownButtonModal>
                                <DropdownContentModal $isOpen={toggleToRole}>
                                    {
                                        RoleOption.map((option, index) => (
                                            <DropdownItemModal key={index} onClick={() => handleOptionRoleClick(option)}>
                                                {handleChangeRoleName(option)}
                                            </DropdownItemModal>
                                        ))
                                    }
                                </DropdownContentModal>
                            </DropdownWrapperModal>
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            파트
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <DropdownWrapperModal>
                                <DropdownButtonModal onClick={toggleDropdownPart}>
                                    {selectedOption || part}
                                    {
                                        !toggleToPart
                                            ? (<ArrowTop1 src={require("../Assets/img/PolygonDown.png")}/>)
                                            : (<ArrowTop1 src={require("../Assets/img/Polygon.png")}/>)
                                    }
                                </DropdownButtonModal>
                                <DropdownContentModal $isOpen={toggleToPart}>
                                    {
                                        PartOption.map((option, index) => (
                                            <DropdownItemModal key={index} onClick={() => handleOptionClick(option)}>
                                                {option}
                                            </DropdownItemModal>
                                        ))
                                    }
                                </DropdownContentModal>
                            </DropdownWrapperModal>
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={70} $weight={500}>
                            삭제
                        </ModalContents>
                        <ModalContents>
                            <CheckScoreButton width='140' onClick={openDeleteConfirmModal}>
                                <Img
                                    src={require("../Assets/img/DeleteIconBlue.png")}
                                    style={{
                                        width: "20px"
                                    }}/>
                                <Span>삭제하기</Span>
                            </CheckScoreButton>
                        </ModalContents>
                        {
                            isOpenDeleteConfirmModal && (
                                <DeleteConfirmModal closeModal={closeDeleteConfirmModal} userEmail={userEmail}/>
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
            case "ALL" :
                return "전체";
                break;
            default:
                break;
        }
    }

    // const formatPhoneNumber = (userInfo) => {
    //     const phoneNumber = userInfo
    //         ?.phoneNumber || "";

    //     // 전화번호가 11글자인지 확인
    //     if (
    //         phoneNumber
    //             ?.length === 11 || phoneNumber
    //                 ?.length > 11
    //     ) {
    //         // 포맷 변경
    //         const formattedNumber = phoneNumber.replace(
    //             /(\d{3})(\d{4})(\d{4})/,
    //             '$1-$2-$3'
    //         );
    //         return formattedNumber;
    //     } else {
    //         // 예외처리: 전화번호가 11글자가 아닌 경우 alert('전화번호는 11글자여야 합니다.');
    //         // console.log(userInfo.phoneNumber);
    //     }
    // }

    const resetRowData = (index) => {
        setGenerationInputs(prev => {
            const newInputs = [...prev];
            newInputs[index] = "";
            return newInputs;
        });
        setNameInputs(prev => {
            const newInputs = [...prev];
            newInputs[index] = "";
            return newInputs;
        });
        setEmailInputs(prev => {
            const newInputs = [...prev];
            newInputs[index] = "";
            return newInputs;
        });
        setPhoneInputs(prev => {
            const newInputs = [...prev];
            newInputs[index] = "";
            return newInputs;
        });
        setSelectedMembers(prev => {
            const newSelected = [...prev];
            newSelected[index] = null;
            return newSelected;
        });
        setSelectedPart(prev => {
            const newSelected = [...prev];
            newSelected[index] = null;
            return newSelected;
        });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    // Main 화면 코드
    return (
        <DDiv>
            <CommonLogSection/>
            <TitleDiv>
                <HomeTitle>회원관리 - 사용자 관리</HomeTitle>
                <BarText/>
                <SubTitle>사용자를 추가하고 관리해보세요.</SubTitle>
            </TitleDiv>
            {
                addable
                    ? (
                        <BodyAddDiv>
                            <FirstDiv>
                                <GenerationDiv>
                                    <FlexDiv>
                                        <MemberNumText color={"#1A1A1A"} $right={4}>
                                            총
                                        </MemberNumText>
                                        <MemberNumText color={"#5262F5"}>
                                            {filteredUserDataList.length}
                                        </MemberNumText>
                                        <MemberNumText color={"#1A1A1A"}>명</MemberNumText>
                                    </FlexDiv>
                                    <GenerationDropDown selectedGeneration={selectedGeneration} isDropDownGeneration={isDropDownGeneration} setIsDropDownGeneration={setIsDropDownGeneration} setSelectedGeneration={setSelectedGeneration} />
                                </GenerationDiv>
                                <RegisterButton onClick={() => setAddable(false)}>
                                    <RegisterMemberIcon src={require("../Assets/img/MemberIcon.png")}/>
                                    사용자 추가
                                </RegisterButton>
                            </FirstDiv>
                            <SecondDiv>
                                <TableHead2>
                                    <TableHead2Cell $flex={1}>
                                        No.
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={1}>
                                        기수
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        이름
                                    </TableHead2Cell >
                                    <TableHead2Cell $flex={4}>
                                        이메일
                                    </TableHead2Cell>
                                    <TableHead2Cell >
                                        전화번호
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        <DropdownWrapper>
                                            <DropdownButton onClick={handleArrowTopClick} $colorValue={true} $Backcolor={"#eee"}>
                                                {handleChangeRoleName(selectedMemberFilter) || "구분"}
                                                {
                                                    !isDropdownOpen
                                                        ? (<ArrowTop1 src={require("../Assets/img/PolygonDown.png")}/>)
                                                        : (<ArrowTop1 src={require("../Assets/img/Polygon.png")}/>)
                                                }
                                            </DropdownButton>
                                            <DropdownContent $isOpen={isDropdownOpen} $left={-5} width={145}>
                                                {
                                                    memberFillter.map((memberOption, memberIndex) => (
                                                        <DropdownItem
                                                            key={memberIndex}
                                                            onClick={() => handleMemberItemClick(memberOption)}>
                                                            {handleChangeRoleName( memberOption )}
                                                        </DropdownItem>
                                                    ))
                                                }
                                            </DropdownContent>
                                        </DropdownWrapper>
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        <DropdownWrapper>
                                            <DropdownButton onClick={handleArrowPartClick} $colorValue={true} $Backcolor={"#eee"}>
                                                {selectedPartFilter || "파트"}
                                                {
                                                    !isdropdownPart
                                                        ? (<ArrowTop1 src={require("../Assets/img/PolygonDown.png")}/>)
                                                        : (<ArrowTop1 src={require("../Assets/img/Polygon.png")}/>)
                                                }
                                            </DropdownButton>
                                            <DropdownContent $isOpen={isdropdownPart} $left={-7} width={120}>
                                                {
                                                    partFillter.map((memberOption, memberIndex) => (
                                                        <DropdownItem
                                                            key={memberIndex}
                                                            onClick={() => handlePartItemClick(memberOption)}>
                                                            {memberOption}
                                                        </DropdownItem>
                                                    ))
                                                }
                                            </DropdownContent>
                                        </DropdownWrapper>
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        관리
                                    </TableHead2Cell >
                                </TableHead2>
                                {
                                    filteredUserDataList.map((userInfo, index) => (
                                        <TableBody2 key={index}>
                                            <TableHead2Cell $flex={1}>
                                                {index + 1}
                                            </TableHead2Cell>
                                            <TableHead2Cell $flex={1}>
                                                {userInfo.generation}기
                                            </TableHead2Cell >
                                            <TableHead2Cell $flex={2}>
                                                {userInfo.name}
                                            </TableHead2Cell >
                                            <TableHead2Cell $flex={4}>
                                                {userInfo.userEmail}
                                            </TableHead2Cell>
                                            <TableHead2Cell >
                                                {formatPhoneNumber(userInfo.phoneNumber)}
                                            </TableHead2Cell>
                                            <TableHead2Cell $flex={2}>
                                                {handleChangeRoleName(userInfo.role)}
                                                {/* {userInfo.role} */}
                                            </TableHead2Cell>
                                            <TableHead2Cell $flex={2}>
                                                {userInfo.part}
                                            </TableHead2Cell>
                                            <TableHead2Cell $flex={2}>
                                                <CheckScoreButton onClick={() => openModal(index)}>
                                                    관리
                                                </CheckScoreButton>
                                            </TableHead2Cell>
                                            <Modal
                                                isModalOpen={modals[index]}
                                                onModalClose={() => closeModal(index)}
                                                closeModalUpdate={() => closeModalUpdate(index)}
                                                name={userInfo.name}
                                                part={userInfo.part}
                                                Num={userInfo.phoneNumber}
                                                role={userInfo.role}
                                                userEmail={userInfo.userEmail}
                                                generation={userInfo.generation}/>
                                        </TableBody2>
                                    ))
                                }
                            </SecondDiv>
                        </BodyAddDiv>
                    )
                    : (
                        <BodyAddDiv>
                            <FirstDiv>
                                <FlexDiv></FlexDiv>
                                <FlexDiv>
                                    <CancelButton onClick={handleCancelClick}>취소하기</CancelButton>
                                    <RegisterAddButton onClick={handleEditButtonClick}>
                                        추가하기
                                    </RegisterAddButton>
                                </FlexDiv>
                            </FirstDiv>
                            <SecondDiv>
                                <TableHead2>
                                    <TableHead2Cell $flex={1}>
                                        No.
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={1}>
                                        기수
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        이름
                                    </TableHead2Cell >
                                    <TableHead2Cell $flex={4}>
                                        이메일
                                    </TableHead2Cell>
                                    <TableHead2Cell >
                                        전화번호
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        구분
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        파트
                                    </TableHead2Cell>
                                    <TableHead2Cell $flex={2}>
                                        초기화
                                    </TableHead2Cell>
                                </TableHead2>
                                {
                                    Array
                                        .from({length: 15})
                                        .map((_, index) => (
                                            <TableBody2 key = {index}>
                                                <TableHead2Cell $flex={1}>
                                                    {index + 1}
                                                </TableHead2Cell>
                                                <TableHead2Cell $flex={1}>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="입력"
                                                        value={generationInputs[index] || ""}
                                                        required
                                                        onChange={(e) => handleGenerationInputChange(e, index)}/>
                                                </TableHead2Cell >
                                                <TableHead2Cell $flex={2}>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="입력"
                                                        value={nameInputs[index] || ""}
                                                        required
                                                        onChange={(e) => handleNameInputChange(e, index)}/>
                                                </TableHead2Cell >
                                                <TableHead2Cell $flex={4}>
                                                    <InputBox
                                                        type="text"
                                                        placeholder="입력"
                                                        value={emailInputs[index] || ""}
                                                        required
                                                        onChange={(e) => handleEmailInputChange(e, index)}/>
                                                </TableHead2Cell>
                                                <TableHead2Cell >
                                                <InputBox
                                                    type="text"
                                                    placeholder="입력"
                                                    value={phoneInputs[index] || ""}
                                                    required
                                                    onChange={(e) => handlePhoneInputChange(e, index)}
                                                    maxLength={13} // XXX-XXXX-XXXX 형식의 최대 길이
                                                />
                                                </TableHead2Cell>
                                                <TableHead2Cell $flex={2}>
                                                    <DropdownWrapper>
                                                        <DropdownButton
                                                            onClick={() => toggleDropdown(index)}
                                                            $hasValue={selectedMembers[index] !== null}>
                                                            {handleChangeRoleName(selectedMembers[index]) || "선택"}
                                                        </DropdownButton>
                                                        <DropdownContent $isOpen={isOpen[index]} $left={-7} width={160} $top={1}>
                                                            {" "}
                                                            {/* 인덱스에 따라 열림 상태 설정 */}
                                                            {
                                                                member.map((memberOption, memberIndex) => (
                                                                    <DropdownItem
                                                                        key={memberIndex}
                                                                        onClick={() => handleMemberClick(memberOption, index)}>
                                                                        {handleChangeRoleName(memberOption)}
                                                                    </DropdownItem>
                                                                ))
                                                            }
                                                        </DropdownContent>
                                                    </DropdownWrapper>
                                                </TableHead2Cell>
                                                <TableHead2Cell $flex={2}>
                                                    <DropdownWrapper1>
                                                    <DropdownButton1
                                                        onClick={() => toggleDropdownPart(index)}
                                                        $hasValue={selectedPart[index] !== null}>
                                                        {selectedPart[index] || "선택"}
                                                    </DropdownButton1>
                                                        <DropdownContent1 $isOpen={isOpenPart[index]}>
                                                            {
                                                                part.map((partOption, partIndex) => (
                                                                    <DropdownItem1
                                                                        key={partIndex}
                                                                        onClick={() => handlePartClick(partOption, index)}>
                                                                        {partOption}
                                                                    </DropdownItem1>
                                                                ))
                                                            }
                                                        </DropdownContent1>
                                                    </DropdownWrapper1>{" "}
                                                </TableHead2Cell>
                                                <TableHead2Cell $flex={2}>
                                                    <ResetButton onClick={() => resetRowData(index)}>
                                                    초기화
                                                    </ResetButton>
                                                </TableHead2Cell>
                                            </TableBody2>
                                        ))
                                }
                            </SecondDiv>
                        </BodyAddDiv>
                    )

            }
        </DDiv>
    );
};

export default UserPage;

export const GenerationDropDown = ({ selectedGeneration, isDropDownGeneration, setIsDropDownGeneration, setSelectedGeneration }) => {
    // 기수 리스트 
    const GenerationList = [1, 2, 3, 4, 5];

    // 기수 변경 시 실행되는 핸들러
    const handleSelectGeneration = (generation) => {
        setSelectedGeneration(generation);
        setIsDropDownGeneration(false);
    }
    return (
        <DropdownGenerationBox>
            <SelectedGeneration><strong>{selectedGeneration}기</strong></SelectedGeneration>
            {
                isDropDownGeneration
                    ? <DropdownGenerationImg src={require("../Assets/img/Polygon.png")} onClick={() => setIsDropDownGeneration(false)} />
                    : <DropdownGenerationImg src={require("../Assets/img/PolygonDown.png")} onClick={() => setIsDropDownGeneration(true)} />

            }
            {isDropDownGeneration && 
                <DropdownGenerationListBox>
                    {
                        GenerationList.map((generation, index) => (
                            <DropdownGenerationItemBox key={index} onClick={() => handleSelectGeneration(generation)}>
                                <span>
                                    {generation}기
                                </span>
                            </DropdownGenerationItemBox>
                        ))

                    }
                </DropdownGenerationListBox>
            }
        </DropdownGenerationBox>
    )
}
const DDiv = styled.div `
    background: #fff;
    margin: 0 auto;
    height: 100%;
    overflow-y: hidden;
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

// const BodyDiv = styled.div `
//     display: flex;
//     flex-direction: column;
//     margin-top: 83px;
//     margin-left: 80px;
//     max-width: 1240px;
//     width: 90%;
//     height: 700px;
// `;

// const TableDiv = styled.div `
//     display: flex;
//     flex-direction: column;
//     width: 1242px;
//     height: 700px;
//     overflow-y: scroll;
// `;

const BodyAddDiv = styled.div `
    display: flex;
    flex-direction: column;
    margin-top: 83px;
    margin-left: 80px;
    width: 77%;
    height: 744px;
`;

const FlexDiv = styled.div `
    display: flex;
    align-items: center;
`;

const FirstDiv = styled.div `
    display: flex;
    height: 48px;
    width: 100%;
    margin-bottom: 16px;
    justify-content: space-between;
    align-items: flex-end;
`;

export const GenerationDiv = styled.div `
    display: flex;
    width: 150px;
`;

const MemberNumText = styled.div `
    color: ${ (props) => props.color};
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-right: ${ (
        props
    ) => props.$right}px;
    `;

    const RegisterMemberIcon = styled.img `
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;

const RegisterButton = styled.button `
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

const RegisterAddButton = styled.button `
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

// const Table = styled.table `
//     border-collapse: collapse;
//     border-spacing: 0;
//     border-radius: 4px;
// `;

// const TableHead = styled.thead `
//     background-color: #eee;
//     border-bottom: 1px solid #a3a3a3;
//     position: sticky;
//     top: 0;
// `;

// const TableBody = styled.tbody `
//     display: block;
//     max-height: calc(100% - 48px);
//     overflow-y: auto;
//     border-bottom: 0.5px solid var(--Gray30, #a3a3a3);
//     &:first-child {
//         border-left: 1px solid var(--Gray30, #a3a3a3);
//     }

//     &:last-child {
//         border-right: 1px solid var(--Gray30, #a3a3a3);
//     }
// `;

// const TableRow = styled.tr `
//     border-bottom: 1px solid #ddd;
//     display: flex;
// `;

// const TableHeaderCell = styled.th `
//     color: var(--black-background, #1a1a1a);
//     font-family: "Pretendard";
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 600;
//     line-height: 24px;
//     display: flex;
//     width: ${ (
//         props
//     ) => props.width}px;
//     height: 48px;
//     justify-content: center;
//     align-items: center;
//     flex-shrink: 0;
//     border-top: 1px solid var(--Gray30, #a3a3a3);
//     border-left: 0.5px solid var(--Gray30, #a3a3a3);
//     border-right: 0.5px solid var(--Gray30, #a3a3a3);
//     background: #fff;

//     &:first-child {
//         border-left: 1px solid var(--Gray30, #a3a3a3);
//         border-radius: 4px 0px 0px 0px;
//     }

//     &:last-child {
//         border-radius: 0px 4px 0px 0px;
//         border-right: 1px solid var(--Gray30, #a3a3a3);
//     }
// `;

const ArrowTop1 = styled.img `
    width: 14px;
    height: 14px;
    margin-left: 16px;
    margin-bottom: 1px;
    cursor: pointer;
    `;

// const TableCell = styled.td `
//     color: ${ (props) => props.color};
//     font-family: "Pretendard";
//     font-size: 14px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 18px;
//     width: ${ (
//         props
//     ) => props.width}px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     min-height: 40px;
//     height: auto;
//     border-right: 0.5px solid var(--Gray30, #a3a3a3);
//     border-left: 0.5px solid var(--Gray30, #a3a3a3);
//     padding-right: ${ (
//         props
//     ) => props.right}px;

//     &:first-child {
//         border-left: 1px solid var(--Gray30, #a3a3a3);
//     }

//     &:last-child {
//         border-right: 1px solid var(--Gray30, #a3a3a3);
//     }
//     background-color: #fff;
// `;

// const TableMinText = styled.td `
//     color: ${ (props) => props.color};
//     font-family: "Pretendard";
//     font-size: 12px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 16px;
//     width: ${ (
//         props
//     ) => props.width}px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     min-height: 40px;
//     height: auto;
//     border-right: 0.5px solid var(--Gray30, #a3a3a3);
//     border-left: 0.5px solid var(--Gray30, #a3a3a3);

//     &:first-child {
//         border-left: 1px solid var(--Gray30, #a3a3a3);
//     }

//     &:last-child {
//         border-right: 1px solid var(--Gray30, #a3a3a3);
//     }
//     background-color: #fff;
//     `;

    const CheckScoreButton = styled.button `
    display: flex;
    width: ${props => props.width || "100"}px;
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

// const NameInputBox = styled.input `
//     width: 100%;
//     height: 100%;
//     font-family: "Pretendard";
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 24px;
//     text-align: center;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border: none;
//     ::placeholder {
//         text-align: center;
//     }
// `;

// const PhoneNumInputBox = styled.input `
//     width: 100%;
//     height: 100%;
//     font-family: "Pretendard";
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 24px;
//     /* padding-left: 75px; */
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border: none;
//     text-align: center;
//     ::placeholder {
//     text-align: center;
//     }
// `;

const DropdownWrapper = styled.div `
    position: relative;
    display: inline-block;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 24px;
    background: var(--White, #fff);
`;

const DropdownButton = styled.button `
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    background: ${ (
    props
    ) => props.$Backcolor};
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 12px;
    color: ${ (
    props
    ) => (
    props.$colorValue
        ? "#1A1A1A"
        : "#A3A3A3"
    )};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DropdownContent = styled.div `
    display: ${ (props) => (
        props.$isOpen
            ? "block"
            : "none"
    )};
    position: absolute;
    background-color: #f1f1f1;
    min-width: ${ (props) => props.width}px;
    z-index: 1;
    top: 100%;
    left: 22px;
    border-radius: 2px 2px 0px 0px;
    background: var(--White, #fff);
    border: 1px solid var(--primary-blue, #5262f5);
    margin-top: ${ (
        props
    ) => props.$top || 5}px;
    margin-left: ${ (props) => props.$left}px;
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

const DropdownWrapper1 = styled.div `
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
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 12px;
    color: ${props => props.$hasValue ? "#1A1A1A" : "#A3A3A3"};
`;

const DropdownContent1 = styled.div `
    display: ${ (props) => (
        props.$isOpen
            ? "block"
            : "none"
    )};
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

const DropdownItem1 = styled.div `
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
`;

const Img = styled.img`
    width: ${props => props.width};
    height : ${props => props.height};
`;

const Span = styled.span`
    margin-top: 3px;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px; 

    color : #5262F5;
`;

const DeleteConfirmModal = ({closeModal, userEmail}) => {

    const handleDeleteUser = async () => {
        // delete the user document in Firestore
        try {
            deleteUserData(userEmail);
            alert("사용자가 삭제되었습니다.");
            window
                .location
                .reload();
            closeModal();
        } catch (error) {
            console.error("Error deleting user : ", error)
        }

    }
    const ContainerDeleteConfirmModal = styled.div `
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

    const ContainerContent = styled.span `
    width : 80%;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
  
    margin-top: 10px;
    margin-bottom: 15px;
  `

    const ContainerBottom = styled.div `
    width : 80%;
    display: flex;
    justify-content: end;
  `

    const Button = styled.span `
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

const SecondDiv = styled.div `
    width: 100%;
    height : 744px;

    display: flex;
    flex-direction: column;

`;

const TableRow2 = styled.div `
    width : 100%;
    height : 48px;
    display: flex;
`;

const TableHead2 = styled(TableRow2)`
    background-color: #eee;
    border-bottom: 1px solid #a3a3a3;
`;
const TableBody2 = styled(TableRow2)`
    background-color: white;
`;

const TableHead2Cell = styled.div `
    width: 100%;
    height : 100%;
    display: flex;
    flex : ${props => props.$flex || 3};
    align-items: center;
    justify-content: center;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;

    border-top: 1px solid var(--Gray30, #a3a3a3);
    border-bottom: 1px solid var(--Gray30, #a3a3a3);
    border-left: 0.5px solid var(--Gray30, #a3a3a3);
    border-right: 0.5px solid var(--Gray30, #a3a3a3);
`;

const InputBox = styled.input `
    width: 100%;
    height : 90%;
    border : none;
    margin : 3px;
    outline: none;
    box-sizing: border-box;

    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
`;

// 모달 관련 Style 코드
const ModalWrapper = styled.div `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: ${ (props) => (props.isModalOpen? "block": "none")};
`;

const ModalContent = styled.div `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 620px;
    height: 640px;
    background-color: white;
`;

const ModalTitleDiv = styled.div `
    display: flex;
    margin-left: 56px;
    margin-top: 40px;
    margin-bottom: 40px;
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
    margin-top: 24px;
    margin-top: ${ (props) => props.top || 46}px;
`;

const ModalContents = styled.div `
    color: ${ (props) => props.color};
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: ${ (props) => props.$weight};
    line-height: 24px;
    margin-right: ${ (props) => props.$right}px;
    margin-top: ${ (props) => props.top}px;
`;

const Input = styled.input `
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
const UpdateButton = styled.button `
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
    cursor: ${ (
        props
    ) => (
        props.disabled
            ? "not-allowed"
            : "pointer"
    )};
    background: ${ (props) => (
        props.disabled
            ? "#A3A3A3"
            : "#5262f5"
    )};
    &:hover {
        box-shadow: ${ (props) => props.disabled
    ? "none"
    : "0px 4px 8px 0px #5262f5"};
    }

    &:active {
        box-shadow: ${ (
        props
    ) => props.disabled
        ? "none"
        : "0px 4px 8px 0px #5262f5 inset"};
    }
`;

const DropdownWrapperModal = styled.div `
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

const DropdownButtonModal = styled.button `
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: white;
    background: ${ (props) => props.$Backcolor};
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 12px;
    /* color: ${ (props) => (props.color? "#1A1A1A": "#A3A3A3")}; */
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--black-background, #1a1a1a);
`;

const DropdownContentModal = styled.div `
    display: ${ (props) => (props.$isOpen? "block" : "none")};
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

const DropdownItemModal = styled.div `
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

const DropdownGenerationBox = styled.div`
    width: 100px;
    height : 35px;
    /* background-color: gray; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin : 0;
    padding : 0;
    position: relative;
    border: 1px solid var(--primary-blue, #5262f5);
    box-sizing: border-box;
    margin-left: 10px;
    background: var(--primary-blue-10, #eeeffe);
    border-radius: 4px;
    color: var(--primary-blue, #5262f5);
    z-index: 1;
`;

const DropdownGenerationListBox = styled.div`
    width: 100%;
    height : auto;
    top : 40px;
    position: absolute;
    background-color: white;
    color: var(--primary-blue, #5262f5);
`

const DropdownGenerationItemBox = styled.div`
    width: 100%;
    height : 30px;
    /* background-color: yellow; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-blue, #5262f5);
    box-sizing: border-box;
    margin-bottom: 0.5px;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`

const DropdownGenerationImg = styled.img`
    width: 15px;
    margin-right: 10px;
`;

const SelectedGeneration = styled.p`
    margin-left: 20px;
`;

const ResetButton = styled.button`
    background-color: #f0f0f0;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #e0e0e0;
    }
`;