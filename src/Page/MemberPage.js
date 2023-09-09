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

const Table = styled.table`
  width: 1300px;
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

const MemberPage = () => {
  const [userScores, setUserScores] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [addable, setAddable] = useState(true);


  const sortedUserScores = userScores.sort((a, b) => {
    // 이름을 가나다 순으로 비교하여 정렬
    return a.name.localeCompare(b.name);
  });

  const filteredUserScores = selectedOption
    ? sortedUserScores.filter((userScore) => userScore.part === selectedOption)
    : sortedUserScores;

  const fetchUsers = async () => {
    const usersRef = collection(dbService, "users");
    const querySnapshot = await getDocs(usersRef);
    const usersData = [];

    // 쿼리 스냅샷을 배열로 변환하여 usersData 배열에 저장합니다.
    querySnapshot.forEach((doc) => {
      usersData.push(doc.data());
    });

    setUserScores(usersData); // 읽어온 데이터를 state에 설정합니다.
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 Firestore에서 "users" 컬렉션을 읽어옵니다.
    fetchUsers();
  }, []);

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
             <RegisterMemberIcon src={require("../Assets/img/MemberIcon.png")} />
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
               <TableHeaderCell style={{ background: "#F8F8F8" }} width={197.5}>
                 이메일
               </TableHeaderCell>
               <TableHeaderCell style={{ background: "#F8F8F8" }} width={197.5}>
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
                   {/* <Modal
                     isOpen={modals[index] || false}
                     // onClose={() => closeModal(index)}
                     name={userScore.name}
                     part={userScore.part}
                     pid={userScore.pid}
                   /> */}
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
          <RegisterButton onClick={() => setAddable(true)}>
            <RegisterMemberIcon src={require("../Assets/img/MemberIcon.png")}/>
            추가하기
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
              <TableHeaderCell style={{ background: "#F8F8F8" }} width={197.5}>
                이메일
              </TableHeaderCell>
              <TableHeaderCell style={{ background: "#F8F8F8" }} width={197.5}>
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
                  {/* <Modal
                    isOpen={modals[index] || false}
                    // onClose={() => closeModal(index)}
                    name={userScore.name}
                    part={userScore.part}
                    pid={userScore.pid}
                  /> */}
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
