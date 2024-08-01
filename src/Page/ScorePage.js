import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import {collection, getDocs, query, where, updateDoc, doc, Timestamp} from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";
import { FadeLoader } from "react-spinners";
import { deleteScoreData, getAllScoreData, postScoreData } from "../Api/ScoreAPI";
import { getAllUserData } from "../Api/UserAPI";
import { getSelectedUserScoreData } from "../Api/ScoreAPI";

/* 
- 모달 관련 코드
  - 모달 열기
  - 모달 닫기
  - 모달 관련 Style 코드
  - 모달 컴포넌트
  - Firebase fireStore Point 데이터 조회
    - 해당 사용자의 pid와 일치하는 Points 데이터 조회
    - "points" 필드 값을 가져옴
    - 배열로 합쳐서 저장
    - "beePoints" 필드 값을 가져옴
    - 배열로 합쳐서 저장
  - 첫 화면 Firebase 렌더링
  - 점수 업데이트 실행 버튼
    - 점수 업데이트 코드
      - 현재 시각 Timestamp 형식으로 변환하여 저장
      - data값 생성
      - Points 데이터를 업데이트할 때는 기존 데이터를 가져온 후 새로운 데이터를 추가하고 다시 업데이트
      - 새로운 데이터를 추가
      - 업데이트된 데이터로 업데이트
      - 창 닫기
    - 토글 점수 리스트
    - 점수용 토글 열기
    - 토글 list 중 점수 선택
      - 만약 벌점 조정일 경우 Input으로 점수 입력할 수 있도록 환경 설졍
  - 로딩 관련 코드
  - 파트 filter 토글 열기
  - 파트 filter 토글 선택
  - Firebase fireStore 전체 Point 데이터 조회
    - 포인트 유형(type)에 따라 각각의 포인트를 계산
    - 포인트 유형(type)에 따라 각각의 포인트를 계산
    - 전체 포인트 합계 계산
  - Main 화면 코드
*/

const ScorePage = () => {
  const [userScores, setUserScores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modals, setModals] = useState([]);
  const [isContentChanged, setContentChanged] = useState(false); // 컨텐츠 변경 확인 state
  const [loading, setLoading] = useState(true);
  const [userScoreDetail, setUserCoreDetail] = useState([]);
  
  const mockData = [
    {
      name: "권채은",
      email : "user1@gmail.com",
      part: "웹파트",
      total_bonus : 10,
      total_minus : 20,
    }, {
      name: "김현승",
      email : "user2@gmail.com",
      part: "서버파트",
      total_bonus : 10,
      total_minus : 20,

    }
  ]

  const mockDataDetail =  [
      {
        reasonId: 8,
        point: 5,
        reason: "MVP",
        detail: "1차 세미나",
        createAt: "2024-07-08T12:21:36.405+00:00",
        bonus: true
      },
      {
        reasonId: 8,
        point: 3,
        reason: "회고",
        detail: "디스콰이엇 회고.",
        createAt: "2024-07-10T12:21:36.405+00:00",
        bonus: true
      },
            {
        reasonId: 8,
        point: 3,
        reason: "회고",
        detail: "디스콰이엇 회고.",
        createAt: "2024-07-10T12:21:36.405+00:00",
        bonus: true
    },
                  {
        reasonId: 8,
        point: 3,
        reason: "회고",
        detail: "디스콰이엇 회고.",
        createAt: "2024-07-10T12:21:36.405+00:00",
        bonus: true
      },
  ]
  // Firebase fireStore 전체 Point 데이터 조회
  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const result = await getAllUserData(3);
        if (result != undefined)
          setUserScores(result);
        else
          setUserScores([]);
        // console.log(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user scores:", error);
      }
    };


    fetchUserScores();
  }, []);

  // 모달 열기
  const openModal = (index) => {
    const newModals = [...modals];
    newModals[index] = true;
    setModals(newModals);


  };

  // 모달 닫기
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
      setContentChanged(false);
    }
  };

  const closeModalWidhtUpdate = (index) => {
    const newModals = [...modals];
    newModals[index] = false;
    setModals(newModals);
  };

  // 핸들러 : 파트 filter 토글 열기
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 핸들러 : 파트 filter 토글 선택
  const handleOptionClick = (option) => {
    if (option === "전체") {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
    setIsOpen(false);
  };

  // 모달 컴포넌트
  const Modal = ({isOpen, onClose, name, part, email, closeModalWidhtUpdate}) => {
    const [points, setPoints] = useState([]); // Points 데이터를 저장할 상태 변수
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedScoreReason, setSelectedScoreReason] = useState(null);
    const [selectedScore, setSelectedScore] = useState(0);
    const [score, setScore] = useState(0);
    const [inputText, setInputText] = useState("");
    const [editScore, setEditScore] = useState(false);

    const handleInputChange = (e) => {
      const text = e.target.value;
      if (text.length <= 20) {
        setInputText(text);
      }
      setContentChanged(true); // 수정사항이 생겼으므로 true로 설정
    };

    // Firebase fireStore Point 데이터 조회
    const fetchPoints = async () => {
      try {
        const result = await getSelectedUserScoreData(email);
        return result;
      } catch (error) {
        console.error("Error fetching Points data:", error);
      }
    };



    // 점수 업데이트 실행 버튼
    const handleAddButtonClick = () => {
      const result = window.confirm("점수를 추가하시겠습니까?");
      if (result) {
        UpdateScore();
      }
    };

    // 점수 업데이트 코드
    const UpdateScore = async () => {
      if (selectedScore && inputText) {
        const scoreMatch = selectedScore.match(/(-?\d+(\.\d+)?)점/);
        
        if (scoreMatch) {
          let scoreDigit = parseFloat(scoreMatch[1]);
          // console.log("score" + scoreDigit);
          let selectedType;
          switch (selectedScore) {
            case "주요 행사 MVP (+5점)":
              selectedType = "MVP";
              break;
            case "세미나 파트별 MVP (+3점)":
              selectedType = "MVP";
              break;
            case "스터디 개최 및 수료 (+5점)":
              selectedType = "스터디";
              break;
            case "스터디 참여및 수료 (+3점)":
              selectedType = "스터디";
              break;
            case "파드 소통 인증 (+1점)":
              selectedType = "소통";
              break;
            case "디스콰이엇 회고 (+3점)":
              selectedType = "회고";
              break;
            case "세미나 지각 벌점 (-1점)":
              selectedType = "세미나 지각";
              break;
            case "세미나 결석 벌점 (-2점)":
              selectedType = "세미나 결석";
              break;
            case "과제 지각 벌점 (-0.5점)":
              selectedType = "과제 지각";
              break;
            case "과제 미제출 (-1점)":
              selectedType = "과제 결석";
              break;

            default:
              selectedType = "벌점 조정";
              break;
          }

          // data값 생성
          const newPoint = {
            email: email,
            point: scoreDigit,
            reason: selectedType,
            detail: inputText,
            bonus: selectedType == "벌점 조정" ? false : true,  
          };

          if (
            inputText === null ||
            selectedType === null
          ) {
          } else {
            try {

              const result = postScoreData(newPoint);

              // 창 닫기
              // onClose(); // 점수 로딩이 늦어서 일단 닫았습니다.
              alert("점수 등록이 성공되었습니다.");
              closeModalWidhtUpdate();
              window.location.reload();
            } catch (error) {
              console.error("Error updating Points data:", error);
            }
          }
        } else {
          // 선택한 점수에서 일치하는 패턴을 찾을 수 없는 경우의 처리
          alert("점수 형식이 올바르지 않습니다.");
        }
      } else {
        window.confirm("빈칸을 확인해주세요");
      }
    };


    // 점수 업데이트 실행 버튼
    const handleDeleteButtonClick = (reasonId) => {
      const result = window.confirm("점수를 삭제하시겠습니까?");
      if (result) {
          deleteScore(reasonId);
          // window.location.reload();
      }
    };

    // 데이터 삭제 함수
    const deleteScore = async (reasonId) => {
        try {
            // // 기존 데이터를 가져옴
            // const pointsQuery = query(
            //     collection(dbService, "points"),
            //     where("pid", "==", pid)
            // );
            // const pointsSnapshot = await getDocs(pointsQuery);
            // const pointsData = pointsSnapshot.docs.map((doc) => doc.data());
            // console.log("pi", pointsData[0]);
            // // 삭제할 데이터를 찾아서 필터링
            // const updatedPoints = pointsData[0].points.filter(
            //     (point) => point.reason !== reasonToDelete
            // );
            // const updatedBeePoints = pointsData[0].beePoints.filter(
            //     (point) => point.reason !== reasonToDelete
            // );
          

            // // 업데이트된 데이터로 업데이트
            // const docRefPoint = doc(dbService, "points", pid);
            // await updateDoc(docRefPoint, {
            //     points: updatedPoints,
            //     beePoints: updatedBeePoints,
            // });

            const result = await deleteScoreData(reasonId);
            // // 삭제 성공 알림
            alert("점수가 성공적으로 삭제되었습니다.");
            closeModalWidhtUpdate();
          window.location.reload();
        } catch (error) {
            console.error("Error deleting Points data:", error);
        }
    };

    // 토글 점수 리스트
    const ScoreList = [
      "주요 행사 MVP (+5점)",
      "세미나 파트별 MVP (+3점)",
      "스터디 개최 및 수료 (+5점)",
      "스터디 참여및 수료 (+3점)",
      "파드 소통 인증 (+1점)",
      "디스콰이엇 회고 (+3점)",
      "세미나 지각 벌점 (-1점)",
      "세미나 결석 벌점 (-2점)",
      "과제 지각 벌점 (-0.5점)",
      "과제 미제출 (-1점)",
      "벌점 조정",
    ];

    // 점수용 토글 열기
    const ScoreoggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    // 토글 list 중 점수 선택
    const handleScoreClick = (option) => {
      setSelectedScoreReason(option);

      // 만약 벌점 조정일 경우 Input으로 점수 입력할 수 있도록 환경 설졍
      if (option === "벌점 조정") {
        setEditScore(true);
      } else {
        setEditScore(false);
      }

      setIsDropdownOpen(false);
    };

    // 예외 처리를 포함한 format 함수
    const formatWithErrorHandling = (reason, type, timestamp, name) => {
      try {
        return format(fromUnixTime(timestamp), "MM.dd", {
          locale: koLocale,
        });
      } catch (error) {
        console.error("name : "+ name +", error index : " + reason + ", type : " + type + ", 날짜 형식 변환 오류:", error);
        return "Invalid Date"; // 또는 다른 기본값을 반환할 수 있습니다.
      }
    };

    // useEffect(() => {
    //   fetchPoints();
    //   if (isOpen) {
    //     setSelectedScore(null);
    //     fetchPoints();
    //   }
    // },[]);
    function formatDate(createdAt) {
      // 날짜 문자열을 Date 객체로 변환
      const date = new Date(createdAt);
      
      // 월과 일을 추출
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      
      // 원하는 형식으로 변환하여 반환
      return `${month.toString().padStart(2, '0')}월 ${day.toString().padStart(2, '0')}일`;
    }

    const ContentDiv2 = ({ userScoreDetail }) => {
        // 파트너십 종류별로 데이터를 그룹화
        const groupedData = userScoreDetail.slice().reverse().reduce((acc, point) => {
          const key = point.reason === "MVP" ? "MVP" : point.reason;
          if (!acc[key]) {
            acc[key] = { points: [], total: 0 };
          }
          acc[key].points.push(point);
          acc[key].total += point.point;
          return acc;
        }, {});
      
        return (
          <div style={{ overflow: "auto", maxHeight: "200px" }}>
            {Object.keys(groupedData).map((reason) => (
              <div key={reason}>
                <h3 style={{ marginLeft: "50px", marginBottom: "0px" }}>
                  {reason} (총 점수: {groupedData[reason].total}점)
                </h3>
                <hr style={{ margin: "0px 50px" }} />
                {groupedData[reason].points.map((point, index) => (
                  <div key={index}>
                    <RowContentDiv>
                      <RowContentType right={30} width={60}>
                        {point.reason === "MVP" ? "MVP" : point.reason}
                      </RowContentType>
                      <RowContentDigit right={38} width={45}>
                        {point.bonus ? `+${point.point}점` : `${point.point}점`}
                      </RowContentDigit>
                      <RowContent right={15} width={200}>
                        {point.detail}
                      </RowContent>
                      <RowContent right={0} width={100}>
                        {formatDate(point.createAt)}
                      </RowContent>
                      {/* <RowContent> */}
                      <RowContent onClick={() => handleDeleteButtonClick(point.reasonId)}>
                        삭제
                      </RowContent>
                    </RowContentDiv>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      };

    return (
      <ModalWrapper isOpen={isOpen}>
        <ModalContent>
          <ModalTitleDiv>
            {isRegisterModalOpen ? (
              <ModalTitle>점수 기록</ModalTitle>
            ) : (
              <ModalTitle>점수 추가</ModalTitle>
            )}
            <CancelIcon
              src={require("../Assets/img/CancelButton.png")}
              onClick={onClose}
            />
          </ModalTitleDiv>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              이름
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              {name}
            </ModalContents>
          </ModalSubTitle>
          <ModalSubTitle>
            <ModalContents color={"#111"} right={71} weight={500}>
              파트
            </ModalContents>
            <ModalContents color={"#A3A3A3"} right={0} weight={600}>
              {part}
            </ModalContents>
          </ModalSubTitle>
          {isRegisterModalOpen ? (
            <div>
              <HR top={24} />
              <RowTitleDiv>
                <RowTitle right={55}>파드너십</RowTitle>
                <RowTitle right={113}>점수</RowTitle>
                <RowTitle right={120}>내용</RowTitle>
                <RowTitle right={70}>날짜</RowTitle>
                <RowTitle right={0}>삭제</RowTitle>
              </RowTitleDiv>
              
              <HR top={8} />
              {/* <ContentDiv>
                {mockDataDetail
                  .slice()
                  .reverse()
                  .map((point, index) => (
                    <div key={index}>
                      <RowContentDiv>
                        <RowContentType right={30} width={60}>
                          {point.reason === "MVP" ? "MVP" : point.reason}
                        </RowContentType>
                        <RowContentDigit right={38} width={45}>
                          {" "}
                          {point.bonus == true
                            ? `+${point.point}점`
                            : `${point.point}점`}
                        </RowContentDigit>
                        <RowContent right={15} width={200}>
                          {point.detail}
                        </RowContent>
                        <RowContent right={0} width={100}>
                            {formatDate(point.createAt)}
                        </RowContent>
                        <RowContent onClick={() => handleDeleteButtonClick(point.reason)}>삭제</RowContent>
                      </RowContentDiv>
                    </div>
                  ))}
              </ContentDiv> */}
              <ContentDiv2 userScoreDetail = {userScoreDetail}>
                
              </ContentDiv2>
              <RegisterButton onClick={() => setIsRegisterModalOpen(false)}>
                점수 추가
              </RegisterButton>
            </div>
          ) : (
            <>
              <ModalSubTitle>
                <ModalContents color={"#111"} top={10} weight={500}>
                  파드너십
                </ModalContents>
                <DropdownWrapper1>
                  <DropdownButton1 onClick={ScoreoggleDropdown}>
                    {selectedScoreReason || "선택"}
                    {isDropdownOpen ? (
                      <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
                    ) : (
                      <ArrowTop1
                        src={require("../Assets/img/PolygonDown.png")}
                      />
                    )}
                  </DropdownButton1>
                  <DropdownContent1 isOpen={isDropdownOpen}>
                    {ScoreList.map((option, index) => (
                      <DropdownItem1
                        key={index}
                        onClick={() => {
                          handleScoreClick(option);
                          setSelectedScore(option);
                          setContentChanged(true); // 수정사항이 생겼으므로 true로 설정
                        }}
                      >
                        {option}
                      </DropdownItem1>
                    ))}
                  </DropdownContent1>
                </DropdownWrapper1>
              </ModalSubTitle>
              <ModalSubTitle top={36}>
                <ModalContents color={"#111"} right={71} weight={500}>
                  점수
                </ModalContents>
                {/* {selectedScore === "벌점 조정" ? ( */}
                {editScore ? (
                  <>
                    <ScoreInput
                      type="text"
                      value={score}
                        onChange={(e) => {
                          const selectedValue = parseFloat(e.target.value);
                          setScore(e.target.value);
                          setSelectedScore(`벌점 조정 (${selectedValue}점)`);
                      }}
                    />
                  </>
                ) : (
                  <ScoreDiv
                    score={
                      selectedScore && selectedScore.match(/(-?\d+(\.\d+)?)점/)
                        ? parseFloat(
                            selectedScore.match(/(-?\d+(\.\d+)?)점/)[1]
                          )
                        : 0
                    }
                  >
                    {selectedScore && selectedScore.match(/(-?\d+(\.\d+)?)점/)
                      ? selectedScore.match(/(-?\d+(\.\d+)?)점/)[1]
                      : 0}
                  </ScoreDiv>
                )}
                <UnitText>점</UnitText>
                <UnitSubText>
                  {!editScore
                    ? "* 파드너십에서 점수 분야를 고르면 자동으로 점수가 입력돼요."
                    : "* 벌점을 직접 입력할 때 -를 제외하고 양수로 입력해주세요"}
                </UnitSubText>
              </ModalSubTitle>
              <ModalSubTitle top={32}>
                <ModalContents color={"#111"} right={71} weight={500}>
                  이유
                </ModalContents>
                <ReasonInput
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="파드 포인트나 벌점 추가하는 사유 (20자 이내)"
                />
              </ModalSubTitle>
              <InputNumNum>{inputText.length}/20</InputNumNum>
              <ModalSubTitle top={20}>
                  <ModalContents color={"#111"} top={-35} right={71} weight={500}>
                  예시
                </ModalContents>
                <ScoreInputExample>
                    1. [MVP] : 1차 세미나 MVP / 숏커톤 MVP <br />
                    2. [스터디] : 피그마 스터디 개최 / 피그마 스터디 수료<br />
                    3. [소통] : 10월 2일 (월) 소통 <br />
                    4. [회고] : 10월 2일 (월) 디콰 회고
                </ScoreInputExample>
              </ModalSubTitle>
              <RegisterAddButton
                onClick={() => {
                  handleAddButtonClick();
                }}
              >
                추가하기
              </RegisterAddButton>
            </>
          )}
        </ModalContent>
      </ModalWrapper>
    );
  };

  // 이름으로 정렬된 유저 정보 변수
  const sortedUserScores = userScores.sort((a, b) => {
    // 이름을 가나다 순으로 비교하여 정렬
    return a.name.localeCompare(b.name);
  });

  // 선택한 파트 option에 맞춰서 필터를 거친 유저 정보 변수
  const filteredUserScores = selectedOption
    ? sortedUserScores.filter((userScore) => userScore.part === selectedOption)
    : sortedUserScores;

    // 로딩 관련 코드
  const override = {
    display: "flex",
    margin: "0 auto",
    marginTop: "300px",
    borderColor: "#5262F5",
    textAlign: "center",
  };

  // 파트별 토글 버튼
  const options = [
    "전체",
    "서버파트",
    "웹파트",
    "iOS파트",
    "디자인파트",
    "기획파트",
  ];

  const fetchUserScoreDetail = async (userEmail, index) => {
    let result;
    if (userEmail != undefined) {
      result = await getSelectedUserScoreData(userEmail);
      setUserCoreDetail(result);
      openModal(index);
    } else {
      alert("사용자 이메일이 존재하지 않습니다.");
    }
    // console.log(result);
    // console.log(mockDataDetail);
  }
  
  // Main 화면 코드
  return (
    <DDiv>
      {/* 사용자 / 로그아웃 */}
      <CommonLogSection />

      {/* 점수 관리 Title Header */}
      <TitleDiv>
        <HomeTitle>점수 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 파드너십을 관리해보세요.</SubTitle>
      </TitleDiv>

      {/* 점수 관리 카테고리 드롭다운 */}
      <DropdownWrapper>
        <DropdownButton onClick={toggleDropdown}>
          {selectedOption || "전체"}
          {!isOpen ? (
            <ArrowTop1 src={require("../Assets/img/PolygonDown.png")} />
          ) : (
            <ArrowTop1 src={require("../Assets/img/Polygon.png")} />
          )}
        </DropdownButton>
        <DropdownContent isOpen={isOpen}>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownWrapper>

      {/* 전체 점수 Table */}
      <BodyDiv>
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableHeaderCell width={140} style={{ background: "#F8F8F8" }}>
                이름
              </TableHeaderCell>
              <TableHeaderCell width={180}>파드너십 점수</TableHeaderCell>
              <TableHeaderCell width={180} style={{ background: "#FFEFEF" }}>
                벌점
              </TableHeaderCell>
              <TableHeaderCell width={180} style={{ background: "#F8F8F8" }}>
                점수 관리
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          {/* Table */}
          <TableBody>
            {loading ? (
              <>
                <FadeLoader
                  color="#5262F5"
                  loading={loading}
                  cssOverride={override}
                  size={100}
                />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></div>
              </>
            ) : (
              <>
                {filteredUserScores.map((userScoreInfo, index) => (
                  <TableRow key={index}>
                    <TableCell color={"#2A2A2A"} width={140}>
                      {userScoreInfo.name}
                    </TableCell>
                    <TableCell color={"#64C59A"} width={180}>
                      +{userScoreInfo.totalBonus}점
                    </TableCell>
                    <TableCell color={"#FF5A5A"} width={180}>
                      {userScoreInfo.totalMinus}점
                    </TableCell>
                    <TableCell width={180}>
                      <CheckScoreButton onClick={() => {
                        fetchUserScoreDetail(userScoreInfo.userEmail, index);
                        
                      }}>
                        점수 관리
                      </CheckScoreButton>
                      <Modal
                        isOpen={modals[index] || false}
                        onClose={() => closeModal(index)}
                        name={userScoreInfo.name}
                        part={userScoreInfo.part}
                        email={userScoreInfo.userEmail}
                        closeModalWidhtUpdate={() =>
                          closeModalWidhtUpdate(index)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </BodyDiv>
    </DDiv>
  );
};

export default ScorePage;

const DDiv = styled.div`
  background: #fff;
  height: 100%;
  overflow-y: hidden;
  margin: 0 auto;
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
  margin-top: 16px;
  margin-left: 80px;
  max-width: 1300px;
  width: 90%;
  height: 700px;
  margin-bottom: 10px;
  overflow-y: scroll;
`;

const Table = styled.table`
  width: auto;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;;
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
  background: #f0f9f5;

  &:first-child {
    border-radius: 4px 0px 0px 0px;
    border-left: 1px solid var(--Gray30, #a3a3a3);
  }

  &:last-child {
    border-radius: 0px 4px 0px 0px;
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
  margin-top: 89px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f1f1f1;
  width: 125px;
  z-index: 1;
  top: 100%;
  left: 0;
  margin-top: 5px;
  border: 1px solid var(--primary-blue, #5262f5);
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

// 모달 관련 Style 코드
  const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
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
    margin-top: ${(props) => props.top || 24}px;
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

  const HR = styled.hr`
    width: 540px;
    height: 0px;
    stroke-width: 1px;
    stroke: var(--Gray30, #a3a3a3);
    margin-top: ${(props) => props.top}px;
  `;

  const RowTitleDiv = styled.div`
    width: 540px;
    height: 20px;
    display: flex;
    margin-left: 57px;
  `;

  const RowTitle = styled.div`
    color: var(--text-black, #111);
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    margin-right: ${(props) => props.right}px;
  `;

  const RowContent = styled.div`
    color: var(--text-black, #111);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    margin-right: ${(props) => props.right}px;
    width: ${(props) => props.width}px;
    /* background-color: red; */
    display: flex;
    align-items: center;
    justify-content: start;
  `;

  const RowContentType = styled.div`
    color: var(--text-black, #111);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    margin-right: ${(props) => props.right}px;
    width: ${(props) => props.width}px;
    /* background-color: red; */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-left: -3px;
  `;

  const RowContentDigit = styled.div`
    margin-right: ${(props) => props.right}px;
    width: ${(props) => props.width}px;
    /* background-color: red; */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: "Pretendard";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
  `;

  const RowContentDiv = styled.div`
    width: 540px;
    height: auto;
    display: flex;
    margin-left: 53px;
    margin-top: 16px;
  `;

  const ContentDiv = styled.div`
    height: 150px;
    overflow-y: scroll;
    margin-top: -8px;
    /* background-color: red; */
  `;

  const RegisterButton = styled.button`
    width: 556px;
    height: 48px;
    margin-left: 32px;
    border-radius: 8px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--primary-blue-10, #eeeffe);
    display: flex;
    width: 556px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: var(--primary-blue, #5262f5);
    /* Head/H1-SB-18 */
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-top: 10px;

    &:hover {
      box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
      box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
  `;

  const DropdownWrapper1 = styled.div`
    position: relative;
    display: inline-block;
    margin-top: 12px;
    margin-left: 40px;
    display: flex;
    width: 220px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: 1px solid var(--primary-blue, #5262f5);
    background: var(--White, #fff);
  `;

  const DropdownButton1 = styled.button`
    cursor: pointer;
    width: 100%;
    height: 100%;
    width: 220px;
    background-color: white;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const DropdownContent1 = styled.div`
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: absolute;
    background-color: #f1f1f1;
    min-width: 218px;
    z-index: 1;
    top: 100%;
    left: 0;
    border: 1px solid #ccc;
    margin-top: 5px;
    border: 1px solid var(--primary-blue, #5262f5);
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

  const ScoreDiv = styled.div`
    width: 42px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => {
      const score = props.score;
      if (score > 0) {
        return "#64C59A";
      } else if (score < 0) {
        return "#FF5A5A";
      } else {
        return "var(--black-background, #1a1a1a)";
      }
    }};
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-right: 8px;
    background: ${(props) => {
      const score = props.score;
      if (score > 0) {
        return "rgba(100, 197, 154, 0.15)";
      } else if (score < 0) {
        return "rgba(255, 90, 90, 0.10)";
      } else {
        return "var(--Gray10, #e4e4e4)";
      }
    }};
  `;

  const UnitText = styled.div`
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-right: 8px;
  `;

  const UnitSubText = styled.div`
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
    margin-top: 8px;
  `;

  const ReasonInput = styled.input`
    width: 385px;
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
    padding-right: 20px;
    color: var(--black-background, #1a1a1a);
    padding-left: 20px;

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
    margin-right: 40px;
  `;

  const RegisterAddButton = styled.button`
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
    margin-top: 40px;
    border: none;
    &:hover {
      box-shadow: 0px 4px 8px 0px #5262f5;
    }
    &:active {
      box-shadow: 0px 4px 8px 0px #5262f5 inset;
    }
  `;

  const ScoreInput = styled.input`
    width: 80px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px solid var(--primary-blue, #5262f5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--black-background, #1a1a1a);
    font-family: "Pretendard";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-right: 8px;
    text-align: center;
  `;

  const ArrowTop1 = styled.img`
    width: 14px;
    height: 14px;
    cursor: pointer;
  `;

const ScoreInputExample = styled.div`
    color: var(--Gray30, #a3a3a3);
    font-family: "Pretendard";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 14px;
`;