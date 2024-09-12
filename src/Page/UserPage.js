import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {deleteUserData, getAllUserData, postUserData} from "../Api/UserAPI";
import {handleChangeRoleName, member, memberFillter, options, PartList } from "../Components/Common/Variables";
import GenerationDropDown from "../Components/Common/GenerationDropDown";
import { PageInfo } from "../Components/Common/PageInfo";
import { BaseContainer } from "../Components/Common/BaseContainer";
import { EditButton, CancelButton, SaveButton } from "../Components/Buttons";

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
    const [birthdayInputs, setBirthdayInputs] = useState(Array(15).fill(""));
    const [phoneInputs, setPhoneInputs] = useState(Array(15).fill(""));
    const [emailInputs, setEmailInputs] = useState(Array(15).fill(""));
    const [selectedMemberFilter, setSelectedMemberFilter] = useState("구분");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPartFilter, setSelectedPartFilter] = useState("파트");
    const [isdropdownPart, setIsdropdownPart] = useState(false);
    const [isContentChanged, setContentChanged] = useState(false); // 컨텐츠 변경 확인 state
    const [selectedGeneration, setSelectedGeneration] = useState();
    const [isDropDownGeneration, setIsDropDownGeneration] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

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
    

    
    // useEffect(() => {
    //     getGenerationId();
    // }, []);
    
    // FIREBASE CODE Firebase fireStore User 데이터 조회
    useEffect(() => {
        const getGenerationId = () => {
            const selectedGeneration = sessionStorage.getItem('selectedGeneration');
            if (selectedGeneration)
                setSelectedGeneration(selectedGeneration);
            else
                setSelectedGeneration(4);
        }

        if (selectedGeneration) {
            const getUsers = async () => {
                const users = await getAllUserData(selectedGeneration);
                // console.log(users);
                setUserDataList(users);
            };
            getUsers();
        } else {
            // console.log("research");
            getGenerationId();
        }

    }, [selectedGeneration]);

    // 토글 코드
    const handleArrowTopClick = () => {
        // Dropdown 열고 닫기 토글
        setOpenDropdown(openDropdown === 'member' ? null : 'member');
        setSelectedPartFilter("파트");
    };

    const handleMemberItemClick = (memberOption) => {
        // 멤버를 선택하고 Dropdown 닫기
        handleArrowTopClick();
        setSelectedMemberFilter(memberOption);
        setOpenDropdown(null); // 드롭다운 닫기
    };

    const handleArrowPartClick = () => {
        // 파트 열고 닫기 토글
        setOpenDropdown(openDropdown === 'part' ? null : 'part');
        setSelectedMemberFilter("구분");
    };

    const handlePartItemClick = (memberOption) => {
        // 멤버를 선택하고 Dropdown 닫기
        handleArrowPartClick();
        setSelectedPartFilter(memberOption);
        setOpenDropdown(null); // 드롭다운 닫기
    };


    const toggleDropdown = (index) => {
        // const updatedIsOpen = [...isOpen];
        // updatedIsOpen[index] = !updatedIsOpen[index];
        // setIsOpen(updatedIsOpen);
        setOpenDropdown(openDropdown === `member-${index}` ? null : `member-${index}`);
        setIsOpenPart(Array(15).fill(false));
    };

    const handleMemberClick = (member, index) => {
        const updatedMembers = [...selectedMembers];
        updatedMembers[index] = member;
        setSelectedMembers(updatedMembers);
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = false;
        setIsOpen(updatedIsOpen);
        setOpenDropdown(null); // 드롭다운 닫기
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
        setOpenDropdown(null); // 드롭다운 닫기
    };

    const toggleDropdownPart = (index) => {
        // setIsOpenPart((prevIsOpenPart) => {
        //     const updatedIsOpenPart = [...prevIsOpenPart];
        //     updatedIsOpenPart[index] = !updatedIsOpenPart[index];
        //     return updatedIsOpenPart;
        // });
        setOpenDropdown(openDropdown === `part-${index}` ? null : `part-${index}`);
        setIsOpen(Array(15).fill(false));
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

    const handleBirthdayInputChange = (e, index) => {
        const updatedBirthdayInputs = [...birthdayInputs];
        updatedBirthdayInputs[index] = e.target.value;
        setBirthdayInputs(updatedBirthdayInputs);
    }

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

    const formatPhoneNumberRemoveHipen = (phoneNumber) => {
        return phoneNumber.replace(/-/g, '');
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
                if (birthdayInputs[index] === "") rowMissingFields.push("생일");
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
                        phoneNumber: formatPhoneNumberRemoveHipen(phoneInputs[index]),
                        role: selectedMembers[index],
                        birthDay : birthdayInputs[index]
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
        Num,
        userEmail,
        role,
        birthDay,
        generation
    }) => {
        const [inputName, setInputName] = useState(name);
        const [inputPhoneNum, setInputPhoneNum] = useState(Num);
        const [selectedOption, setSelectedOption] = useState(part);
        const [selectedRoleOption, setSelectedRoleOption] = useState(role);
        const [toggleToPart, setToggleToPart] = useState(false);
        const [toggleToRole, setToggleToRole] = useState(false);
        const [isEditm, setIsEdit] = useState(false);
        const [inputGeneration, setInputGeneration] = useState(generation);
        const [inputBirthday, setInputBirthday] = useState(birthDay);
        const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] = useState(false);
        const [contentChanged, setContentChanged] = useState(false);
        const [openDropdown, setOpenDropdown] = useState(null);

        useEffect(() => {
            if (isModalOpen) {
                setIsEdit(true);
            }
        }, [isModalOpen]);
        const toggleDropdown = (dropdownName) => {
            setOpenDropdown(prevDropdown => prevDropdown === dropdownName ? null : dropdownName);
        };


        const handleNameChange = (e) => {
            const text = e.target.value;
            if (text.length <= 10) {
                setInputName(text);
                setContentChanged(true);
            }
        };

        const handleBirthdayChange = (e) => {
            const text = e.target.value;
            if (text.length <= 10) {
                setInputBirthday(text);
                setContentChanged(true);
            }
        };

        const handlePhoneNumChange = (e) => {
            const formattedPhoneNumber = formatPhoneNumber(e.target.value);
            setInputPhoneNum(formattedPhoneNumber);
            setContentChanged(true);
        };

        const handleGenerationChange = (e) => {
            const text = e.target.value;
            if (text.length <= 20) {
                setInputGeneration(text);
                setContentChanged(true);
            }
        };

        const handleOptionClick = (option) => {
            if (option === "ALL") {
                setSelectedOption(null);
            } else {
                setSelectedOption(option);
                setContentChanged(true);
            }
            setToggleToPart(false);
            setOpenDropdown(null);  // 드롭다운 닫기
        };

        const handleOptionRoleClick = (option) => {
            if (option === "ALL") {
                setSelectedRoleOption(null);
            } else {
                setSelectedRoleOption(option);
                setContentChanged(true);
            }
            setToggleToRole(false);
            setOpenDropdown(null);  // 드롭다운 닫기
        };

        const toggleDropdownPart = () => {
            setToggleToPart(!toggleToPart);
        };

        const toggleDropdownRole = () => {
            setToggleToRole(!toggleToRole);
        };

        const handleUpdateButtonClick = async () => {
            const confirmUpdate = window.confirm("사용자 정보를 수정하시겠습니까?");

            if (confirmUpdate) {
                try {
                    const updatedUserInfo = {
                        name: inputName,
                        email: userEmail,
                        part: selectedOption,
                        phoneNumber: formatPhoneNumberRemoveHipen(inputPhoneNum),
                        role: selectedRoleOption,
                        generation: inputGeneration,
                        birthDay: inputBirthday
                    };
                    const response = await postUserData([updatedUserInfo]);
                    if (response) {
                        alert("사용자 정보가 업데이트되었습니다.");
                        closeModalUpdate();
                        setContentChanged(false);
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("사용자 정보 업데이트 실패:", error);
                    alert("사용자 정보 업데이트 중 오류가 발생했습니다.");
                }
            }
        };

        const openDeleteConfirmModal = () => {
            setIsOpenDeleteConfirmModal(true);
        };

        const closeDeleteConfirmModal = () => {
            setIsOpenDeleteConfirmModal(false);
        };

        return (
            <ModalWrapper $isModalOpen={isModalOpen}>
                <ModalContent>
                    <ModalTitleDiv>
                        <ModalTitle>사용자 정보 수정하기</ModalTitle>
                        <CancelIcon
                            src={require("../Assets/img/CancelButton.png")}
                            onClick={onModalClose}
                        />
                    </ModalTitleDiv>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            이름
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <Input
                                value={inputName}
                                onChange={handleNameChange}
                                placeholder="이름을 10자 이내로 작성해주세요."
                            />
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
                                maxLength={13}
                            />
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            생일
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <Input
                                value={inputBirthday}
                                onChange={handleBirthdayChange}
                                maxLength={4}
                                placeholder="생일을 4자 이내로 작성해주세요."
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
                                maxLength={1}
                                onChange={handleGenerationChange}
                                placeholder="기수를 작성해주세요."
                            />
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={71} $weight={500}>
                            구분
                        </ModalContents>
                        <ModalContents color={"#A3A3A3"} $right={0} $weight={600}>
                            <DropdownWrapperModal>
                                    <DropdownButtonModal onClick={() => toggleDropdown('role')}>
                                        {handleChangeRoleName(selectedRoleOption || role)}
                                        <ArrowTop1 src={require(`../Assets/img/${openDropdown === 'role' ? 'Polygo.png' : 'PolygonDown.png'}`)} />
                                    </DropdownButtonModal>
                                    <DropdownContentModal $isOpen={openDropdown === 'role'}>
                                    {["ROLE_YB", "ROLE_OB", "ROLE_ADMIN"].map((option, index) => (
                                        <DropdownItemModal key={index} onClick={() => handleOptionRoleClick(option)}>
                                            {handleChangeRoleName(option)}
                                        </DropdownItemModal>
                                    ))}
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
                                <DropdownButtonModal onClick={() => toggleDropdown('part')}>
                                    {selectedOption || part}
                                    <ArrowTop1 src={require(`../Assets/img/${openDropdown === 'part' ? 'Polygon.png' : 'PolygonDown.png'}`)} />
                                </DropdownButtonModal>
                                <DropdownContentModal $isOpen={openDropdown === 'part'}>
                                    {PartList.map((option, index) => (
                                        <DropdownItemModal key={index} onClick={() => handleOptionClick(option)}>
                                            {option}
                                        </DropdownItemModal>
                                    ))}
                                </DropdownContentModal>
                            </DropdownWrapperModal>
                        </ModalContents>
                    </ModalSubTitle>
                    <ModalSubTitle>
                        <ModalContents color={"#111"} $right={70} $weight={500}>
                            삭제
                        </ModalContents>
                        <ModalContents>
                            <CheckScoreButton width='140px' onClick={openDeleteConfirmModal}>
                                <Img
                                    src={require("../Assets/img/DeleteIconBlue.png")}
                                    style={{
                                        width: "20px"
                                    }}
                                />
                                <Span>삭제하기</Span>
                            </CheckScoreButton>
                        </ModalContents>
                        {isOpenDeleteConfirmModal && (
                            <DeleteConfirmModal closeModal={closeDeleteConfirmModal} userEmail={userEmail} />
                        )}
                    </ModalSubTitle>
                    <UpdateButton disabled={!contentChanged} onClick={handleUpdateButtonClick}>
                        저장하기
                    </UpdateButton>
                </ModalContent>
            </ModalWrapper>
        );
    };





    const resetRowData = (index) => {
        if (window.confirm("초기화 하시겠습니까?")) {
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
            setBirthdayInputs(prev => {
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
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength <= 3) return phoneNumber;
        if (phoneNumberLength <= 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    // Main 화면 코드
    return (
        <BaseContainer>
            <CommonLogSection />
            
            <PageInfo title="사용자 관리" subTitle="사용자를 추가하고 관리해보세요." />
            
            {
                addable
                    ? (
                        <ContentContainer>
                            <FirstContainer>
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
                                <EditButton onClick={() => setAddable(false)}>
                                    <RegisterMemberIcon src={require("../Assets/img/MemberIcon.png")}/>
                                    사용자 추가
                                </EditButton>
                            </FirstContainer>
                            <SecondContainer>
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
                                        생일
                                    </TableHead2Cell >
                                    <TableHead2Cell $flex={2} $overflowX = "none">
                                        <DropdownWrapper>
                                            <DropdownButton onClick={handleArrowTopClick} $colorValue={true} $Backcolor={"#eee"}>
                                                {handleChangeRoleName(selectedMemberFilter) || "구분"}
                                                <ArrowTop1 src={require(`../Assets/img/${openDropdown === 'member' ? 'Polygon.png' : 'PolygonDown.png'}`)} />
                                            </DropdownButton>
                                            <DropdownContent $isOpen={openDropdown === 'member'} $left={-5} width={145}>
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
                                    <TableHead2Cell $flex={2} $overflowX = "none">
                                        <DropdownWrapper>
                                            <DropdownButton onClick={handleArrowPartClick} $colorValue={true} $Backcolor={"#eee"}>
                                                {selectedPartFilter || "파트?"}
                                                <ArrowTop1 src={require(`../Assets/img/${openDropdown === 'part' ? 'Polygon.png' : 'PolygonDown.png'}`)} />
                                            </DropdownButton>
                                            <DropdownContent $isOpen={openDropdown === 'part'} $left={-7} width={120}>
                                                {
                                                    options.map((memberOption, memberIndex) => (
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
                                                {userInfo.birthDay[0]+userInfo.birthDay[1]+'월 ' + userInfo.birthDay[2] + userInfo.birthDay[3] + "일"}
                                            </TableHead2Cell >
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
                                                birthDay={userInfo.birthDay}
                                                generation={userInfo.generation}/>
                                        </TableBody2>
                                    ))
                                }
                            </SecondContainer>
                        </ContentContainer>
                    )
                    : (
                        <ContentContainer>
                            <FirstContainer>
                                <FlexDiv></FlexDiv>
                                <FlexDiv>
                                    <CancelButton onClick={handleCancelClick}>취소하기</CancelButton>
                                    <SaveButton onClick={handleEditButtonClick}>
                                        추가하기
                                    </SaveButton>
                                </FlexDiv>
                            </FirstContainer>
                            <SecondContainer>
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
                                        생일
                                    </TableHead2Cell >
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
                                                    <InputBox
                                                        type="text"
                                                        placeholder="입력"
                                                        value={birthdayInputs[index] || ""}
                                                        required
                                                        onChange={(e) => handleBirthdayInputChange(e, index)}/>
                                                </TableHead2Cell >
                                                
                                                <TableHead2Cell $flex={2} $overflowX = "none">
                                                    <DropdownWrapper>
                                                        <DropdownButton1
                                                            onClick={() => toggleDropdown(index)}
                                                            $hasValue={selectedMembers[index] !== null}
                                                        >
                                                            {handleChangeRoleName(selectedMembers[index]) || "선택"}
                                                        </DropdownButton1>
                                                        <DropdownContent $isOpen={openDropdown === `member-${index}`} $left={-7} width={160} $top={1}>
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
                                                <TableHead2Cell $flex={2} $overflowX = "none">
                                                    <DropdownWrapper1>
                                                        <DropdownButton1
                                                            onClick={() => toggleDropdownPart(index)}
                                                            $hasValue={selectedPart[index] !== null}>
                                                            {selectedPart[index] || "선택"}
                                                        </DropdownButton1>
                                                        <DropdownContent1 $isOpen={openDropdown === `part-${index}`}>
                                                            {
                                                                PartList.map((partOption, partIndex) => (
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
                            </SecondContainer>
                        </ContentContainer>
                    )

            }
        </BaseContainer>
    );
};

export default UserPage;

const ContentContainer = styled.div `
    display: flex;
    flex-direction: column;

    margin-top: 83px;

    width: 100%;
    height: auto;
    /* background-color: red; */

`;

const FirstContainer = styled.div `
    width: 100%;
    /* height: auto; */

    display: flex;
    justify-content: space-between;
    align-items: center;

    /* margin-bottom: 16px; */
    /* background-color: yellow; */
`;

const SecondContainer = styled.div `
    width: 100%;
    height : 60vh;
    overflow-y: scroll;

    display: flex;
    flex-direction: column;

    /* background-color: green; */

    box-sizing: border-box;
    border-top : 0.5px solid #a3a3a3;
    border-bottom : 0.5px solid #a3a3a3;

    margin-top: 20px;


    /* 스크롤바 숨기기 */
    ::-webkit-scrollbar {
        display : ${props => props.$type === true ? "none" : "none"}; /* Chrome, Safari, Edge, Opera */
    }
    
    -ms-overflow-style: none;  /* IE 10+ */
    scrollbar-width: none;  /* Firefox */

`;





const FlexDiv = styled.div `
    display: flex;
    align-items: center;
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

const ArrowTop1 = styled.img `
    max-width: 14px;
    width: 1vw;
    /* height: 14px; */
    margin-left: 16px;
    margin-bottom: 1px;
    cursor: pointer;
    @media (min-width: 1200px) {
        font-size: 18px;
    }
`;

const CheckScoreButton = styled.button `
    display: flex;
    width: ${props => props.width || "90%"};
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    color: var(--primary-blue, #5262f5);
    font-family: "Pretendard";
    font-size: 1vw;
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
    @media (min-width: 1200px) {
        font-size: 18px;
    }
`;

const DropdownWrapper = styled.div `
    position: relative;
    display: inline-block;
    display: flex;
    width: 100%;
    height : 100%;
    justify-content: center;
    align-items: center;
    gap: 24px;
    background: var(--White, #fff);
    border-bottom : 1px solid #a3a3a3;
    box-sizing: border-box;
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
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border : none;
    border-bottom: 1px solid #a3a3a3;

    

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
    
    @media (min-width: 1200px) {
        font-size: 18px;
    }
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
    color: black;
    font-family: "Pretendard";
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    &:hover {
        background-color: #eeeffe;
    }
    @media (min-width: 1200px) {
        font-size: 15px;
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
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    padding: 8px 12px;
    color: ${props => props.$hasValue ? "#1A1A1A" : "#A3A3A3"};

    @media (min-width: 1200px) {
        font-size: 18px;
    }
    
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
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    &:hover {
        background-color: #eeeffe;
    }
    @media (min-width: 1200px) {
        font-size: 15px;
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



const TableRow2 = styled.div `
    width : 100%;
    min-height : 48px;
    display: flex;
`;

const TableHead2 = styled(TableRow2)`
    background-color: #eee;
    border-bottom: 1px solid #a3a3a3;
    position: sticky;
    top: 0;
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
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    overflow-x: ${props => props.$overflowX|| "hidden"};

    border-top: 1px solid var(--Gray30, #a3a3a3);
    border-bottom: 1px solid var(--Gray30, #a3a3a3);
    border-left: 0.5px solid var(--Gray30, #a3a3a3);
    border-right: 0.5px solid var(--Gray30, #a3a3a3);
    /* overflow-x: hidden; */
    @media (min-width: 1200px) {
        font-size: 18px;
    }
`;

const InputBox = styled.input `
    width: 100%;
    height : 90%;
    border : none;
    margin : 3px;
    outline: none;
    box-sizing: border-box;

    font-family: "Pretendard";
    font-size: 1vw;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    @media (min-width: 1200px) {
        font-size: 18px;
    }
`;

// 모달 관련 Style 코드
const ModalWrapper = styled.div `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: ${ (props) => (props.$isModalOpen ? "block" : "none")};
    z-index: 1;
`;

const ModalContent = styled.div `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 620px;
    height: 700px;
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
    font-size: 1vw;
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
    @media (min-width: 1200px) {
        font-size: 16px;
    }
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
    font-size: 1vw;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    border: 0.5px solid var(--primary-blue, #5262f5);
    text-align: center;
    &:hover {
        background: var(--primary-blue-10, #eeeffe);
    }
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
    `;

    const ContainerBottom = styled.div`
        width : 80%;
        display: flex;
        justify-content: end;
    `;

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
    `;
    
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