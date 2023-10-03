import styled from "styled-components";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, dbService } from "../fbase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Div = styled.div`
  background: #fff;
  margin: 0 auto;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 165px;
`;

const PardLogo = styled.img`
  width: 223px;
  height: 46px;
  margin-right: 24px;
`;

const TitleText = styled.div`
  color: var(--black-background, #1a1a1a);
  font-family: "Pretendard";
  font-size: 38px;
  font-style: normal;
  font-weight: 600;
  line-height: 56px;
`;

const LogoImg = styled.img`
  display: flex;
  width: 655px;
  height: 252.907px;
  margin-bottom: 161.99px;
`;

const Body3 = styled.div`
  color: var(--Gray30, #a3a3a3);
  font-family: "Pretendard";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 24px;
`;

const GoogleLoginButton = styled.button`
  border: none;
  display: flex;
  width: 472px;
  height: 56px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--grabp, linear-gradient(92deg, #5262f5 0%, #7b3fef 100%));
  color: var(--White, #fff);
  font-family: "Pretendard";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;
  img {
    width: 22px;
    height: 22px;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();

  // 로그인 코드
  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((data) => {
        const user = data.user;
        const userEmail = user.email;

        const pointsQuery = query(
          collection(dbService, "users"),
          where("email", "==", userEmail)
        );
        getDocs(pointsQuery)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0].data();
              const isAdmin = doc.isAdmin;

              if (isAdmin) {
                alert("로그인 되었습니다.");
                localStorage.setItem("token", "pardo-admin-key");
                localStorage.setItem("userName", user.displayName);
                // console.log(localStorage.getItem("token"));
                navigate("/");
                window.location.reload();
              } else {
                alert("로그인 실패: 권한 없음");
              }
            } else {
              alert("로그인 실패: 해당 사용자 정보 없음");
            }
          })
          .catch((error) => {
            console.error("Firestore에서 문서 가져오기 오류:", error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Div>
      <FlexDiv>
        <PardLogo src={require("../Assets/img/Login/Original.png")} />
        <TitleText>관리자 페이지</TitleText>
      </FlexDiv>
      <LogoImg src={require("../Assets/img/Login/ImgLogo.png")} />
      <Body3>
        * 본 사이트는 관리자 권한이 있는 사용자만 접근 가능한 사이트 입니다.
      </Body3>
      <GoogleLoginButton onClick={handleGoogleLogin}>
        <img src={require("../Assets/img/Login/GoogleLogo.png")} />
        구글로 로그인 하기
      </GoogleLoginButton>
    </Div>
  );
};
export default LoginPage;
