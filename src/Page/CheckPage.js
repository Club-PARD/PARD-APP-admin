import styled from "styled-components";
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

const CheckPage = () => {
  const [userDatas, setUserDatas] = useState([]);

  useEffect(() => {
    // Firestore에서 데이터 읽어오기
    const fetchData = async () => {
      try {
        const usersRef = collection(dbService, "users");
        const querySnapshot = await getDocs(usersRef);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push(doc.data());
        });

        setUserDatas(userDatas);
        console.log("userDatas :", userDatas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DDiv>
      <CommonLogSection username="김파드님" />
      <TitleDiv>
        <HomeTitle>출결 관리</HomeTitle>
        <BarText />
        <SubTitle>파트별로 출결을 관리해보세요.</SubTitle>
      </TitleDiv>
      <BodyDiv>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell width={140} style={{ background: "#F8F8F8" }}>
                이름
              </TableHeaderCell>
              <TableHeaderCell width={206}>OT</TableHeaderCell>
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
            {userDatas.map((userData, index) => (
              <TableRow key={index}>
                <TableCell color={"#2A2A2A"} width={140}>
                  {userData.name}
                </TableCell>
                <TableCell width={205}>
                  <CheckScoreButton>점수 관리</CheckScoreButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </BodyDiv>
    </DDiv>
  );
};

export default CheckPage;
