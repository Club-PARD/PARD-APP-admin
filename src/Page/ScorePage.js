import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonLogSection from "../Components/Common/LogDiv_Comppnents";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbService } from "../fbase";
import { format, fromUnixTime } from "date-fns";
import koLocale from "date-fns/locale/ko";

const DDiv = styled.div`
  background: #f6f6f6;
  margin: 0 auto;
  height: 100%;
`;

const TitleDiv = styled.div`
  display: flex;
  margin-top: 36px;
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
  width: 1396px;
  height: 744px;
`;

const Table = styled.table`
  width: 1380px;
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

const ScorePage = () => {
  const [userScores, setUserScores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modals, setModals] = useState([]);

  const openModal = (index) => {
    const newModals = [...modals];
    newModals[index] = true;
    setModals(newModals);
  };

  const closeModal = (index) => {
    const newModals = [...modals];
    newModals[index] = false;
    setModals(newModals);
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
  `;

  const ModalContents = styled.div`
    color: ${(props) => props.color};
    font-family: "Pretendard";
    font-size: 18px;
    font-style: normal;
    font-weight: ${(props) => props.weight};
    line-height: 24px;
    margin-right: ${(props) => props.right}px;
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
  `;

  const RowContentDigit = styled.div`
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
    justify-content: flex-end;
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
    margin-top: 66px;

    &:hover {
      box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
      box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
  `;

  // 모달 컴포넌트
  const Modal = ({ isOpen, onClose, name, part, pid }) => {
    const [points, setPoints] = useState([]); // Points 데이터를 저장할 상태 변수

    // Points 데이터를 가져오는 함수
    const fetchPoints = async () => {
      try {
        const pointsQuery = query(
          collection(dbService, "points"),
          where("pid", "==", pid) // 해당 사용자의 pid와 일치하는 Points 문서를 가져옴
        );
        const pointsSnapshot = await getDocs(pointsQuery);
        const pointsData = [];

        pointsSnapshot.forEach((pointDoc) => {
          const pointData = pointDoc.data().points; // "points" 필드 값을 가져옴
          pointsData.push(...pointData); // 배열로 합쳐서 저장
        });
        pointsSnapshot.forEach((beePointDoc) => {
          const beePointData = beePointDoc.data().beePoints; // "beePoints" 필드 값을 가져옴
          pointsData.push(...beePointData); // 배열로 합쳐서 저장
        });

        setPoints(pointsData);
      } catch (error) {
        console.error("Error fetching Points data:", error);
      }
    };

    useEffect(() => {
      if (isOpen) {
        // 모달이 열릴 때만 Points 데이터를 가져옴
        fetchPoints();
        console.log("data : ", points);
      }
    }, [isOpen, pid]);

    return (
      <ModalWrapper isOpen={isOpen}>
        <ModalContent>
          <ModalTitleDiv>
            <ModalTitle>점수 기록</ModalTitle>
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
          <HR top={24} />
          <RowTitleDiv>
            <RowTitle right={57}>파드너십</RowTitle>
            <RowTitle right={103}>점수</RowTitle>
            <RowTitle right={203}>내용</RowTitle>
            <RowTitle right={0}>날짜</RowTitle>
          </RowTitleDiv>
          <HR top={8} />
          <ContentDiv>
            {points
              .slice()
              .reverse()
              .map((point, index) => (
                <div key={index}>
                  <RowContentDiv>
                    <RowContentType right={40} width={60}>
                      {point.type}
                    </RowContentType>
                    <RowContentDigit right={30} width={30}>
                      {" "}
                      {point.digit > 0
                        ? `+${point.digit}점`
                        : `${point.digit}점`}
                    </RowContentDigit>
                    <RowContent right={100} width={190}>
                      {point.reason}
                    </RowContent>
                    <RowContent right={0} width={50}>
                      {format(fromUnixTime(point.timestamp), "MM.dd(EEE)", {
                        locale: koLocale,
                      })}
                    </RowContent>
                  </RowContentDiv>
                </div>
              ))}
          </ContentDiv>
          <RegisterButton>점수 추가</RegisterButton>
        </ModalContent>
      </ModalWrapper>
    );
  };

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

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const userQuery = query(collection(dbService, "users"));
        const userSnapshot = await getDocs(userQuery);

        const scores = [];

        for (const userDoc of userSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          // 사용자의 포인트 데이터 가져오기
          const pointQuery = query(
            collection(dbService, "points"),
            where("uid", "==", userId)
          );
          const pointSnapshot = await getDocs(pointQuery);

          let mvpPoints = 0;
          let studyPoints = 0;
          let communicationPoints = 0;
          let retrospectionPoints = 0;
          let penaltyPoints = 0; // 벌점 포인트

          pointSnapshot.forEach((pointDoc) => {
            const pointData = pointDoc.data();
            pointData.points.forEach((point) => {
              // 포인트 유형(type)에 따라 각각의 포인트를 계산
              switch (point.type) {
                case "MVP":
                  mvpPoints += point.digit;
                  break;
                case "스터디":
                  studyPoints += point.digit;
                  break;
                case "소통":
                  communicationPoints += point.digit;
                  break;
                case "회고":
                  retrospectionPoints += point.digit;
                  break;
                // 다른 포인트 유형에 대한 계산도 추가할 수 있음
              }
            });
            pointData.beePoints.forEach((beePoints) => {
              // 포인트 유형(type)에 따라 각각의 포인트를 계산
              penaltyPoints += beePoints.digit;
            });
          });

          // 전체 포인트 합계 계산
          const totalPoints =
            mvpPoints + studyPoints + communicationPoints + retrospectionPoints;

          scores.push({
            name: userData.name,
            pid: userData.pid,
            mvp: mvpPoints,
            study: studyPoints,
            communication: communicationPoints,
            retrospection: retrospectionPoints,
            penalty: penaltyPoints, // 벌점 포인트
            total: totalPoints, // 전체 포인트 합계
            part: userData.part,
          });
        }

        setUserScores(scores);
      } catch (error) {
        console.error("Error fetching user scores:", error);
      }
    };

    fetchUserScores();
  }, []);

  const sortedUserScores = userScores.sort((a, b) => {
    // 이름을 가나다 순으로 비교하여 정렬
    return a.name.localeCompare(b.name);
  });

  const filteredUserScores = selectedOption
    ? sortedUserScores.filter((userScore) => userScore.part === selectedOption)
    : sortedUserScores;

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>점수 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 파드너십을 관리해보세요.</SubTitle>
      </TitleDiv>
      <DropdownWrapper>
        <DropdownButton onClick={toggleDropdown}>
          {selectedOption || "전체"}
        </DropdownButton>
        <DropdownContent isOpen={isOpen}>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownWrapper>
      <BodyDiv>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell width={140} style={{ background: "#F8F8F8" }}>
                이름
              </TableHeaderCell>
              <TableHeaderCell width={206}>MVP</TableHeaderCell>
              <TableHeaderCell width={206}>스터디</TableHeaderCell>
              <TableHeaderCell width={206}>소통</TableHeaderCell>
              <TableHeaderCell width={206}>회고</TableHeaderCell>
              <TableHeaderCell
                width={205}
                style={{ background: "rgba(255, 90, 90, 0.10)" }}
              >
                벌점
              </TableHeaderCell>
              <TableHeaderCell width={205} style={{ background: "#F8F8F8" }}>
                점수 관리
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {filteredUserScores.map((userScore, index) => (
              <TableRow key={index}>
                <TableCell color={"#2A2A2A"} width={140}>
                  {userScore.name}
                </TableCell>
                <TableCell color={"#64C59A"} width={206}>
                  +{userScore.mvp}점
                </TableCell>
                <TableCell color={"#64C59A"} width={206}>
                  +{userScore.study}잠
                </TableCell>
                <TableCell color={"#64C59A"} width={206}>
                  +{userScore.communication}점
                </TableCell>
                <TableCell color={"#64C59A"} width={206}>
                  +{userScore.retrospection}점
                </TableCell>
                <TableCell color={"#FF5A5A"} width={205.2}>
                  {userScore.penalty}점
                </TableCell>
                <TableCell width={205}>
                  <CheckScoreButton onClick={() => openModal(index)}>
                    점수 관리
                  </CheckScoreButton>
                  <Modal
                    isOpen={modals[index] || false}
                    onClose={() => closeModal(index)}
                    name={userScore.name}
                    part={userScore.part}
                    pid={userScore.pid}
                  />
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </BodyDiv>
    </DDiv>
  );
};

export default ScorePage;
