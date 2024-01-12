import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, dbService } from "../fbase";
import { collection, getDocs, where, query } from "firebase/firestore";



/* 
- Google 로그인 코드
  - Google login을 통한 사용자 정보 조회
  - Firebase Firestore 조회
  - 운영진 유무 확인
*/


// Google 로그인 코드
export const handleGoogleLogin = (navigate) => {
  const provider = new GoogleAuthProvider();

  // Google login을 통한 사용자 정보 조회
  signInWithPopup(auth, provider)
    .then((data) => {
      const user = data.user;
      const userEmail = user.email;

      const pointsQuery = query(
        collection(dbService, "users"),
        where("email", "==", userEmail)
      );

      // Firebase Firestore 조회
      getDocs(pointsQuery)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0].data();
            const isAdmin = doc.isAdmin;
            // 운영진 유무 확인
            if (isAdmin) {
              alert("로그인 되었습니다.");
              localStorage.setItem("token", "pardo-admin-key");
              localStorage.setItem("userName", user.displayName);
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
};
