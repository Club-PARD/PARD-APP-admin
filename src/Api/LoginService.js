import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth, dbService} from "../fbase";
import axios from "axios";
import Cookies from 'js-cookie';


/*
- Google 로그인 코드
  - Google login을 통한 사용자 정보 조회
  - Firebase Firestore 조회
  - 운영진 유무 확인
*/

// Google 로그인 코드
export const handleGoogleLogin = async (navigate) => {
    const provider = new GoogleAuthProvider();

    try {
        // Google login을 통한 사용자 정보 조회
        const data = await signInWithPopup(auth, provider);
        const user = data.user;
        const userEmail = user.email;

        // handleLoginAPI 호출 및 결과 출력
        const response = await handleLoginAPI(userEmail);
        if (response) {
            console.log(user.displayName);
            alert("로그인되었습니다.");
            localStorage.setItem("token", "pardo-admin-key");
            localStorage.setItem("userName", user.displayName);
            navigate("/");
            window
                .location
                .reload();
        } else {
            localStorage.removeItem();
        }

    } catch (err) {
        console.log(err);
    }
};

const handleLoginAPI = async (email) => {
    try {
        const response = await axios.post(
            //  "https://we-pard.store/v1/users/login",
            "/v1/users/login",
            { email }
            // , {
            //     withCredentials: true
            // }
        );
        return response.data;
    } catch (error) {
        console.log("get error");
        throw error;
    }
};

export const handleCheckCookie = () => {
    const cookieName = ''
    const cookieValue = Cookies.get();  
    // JSON.parse(cookieValue.replace(new RegExp(/'/g), '"'));
    console.log(cookieValue);
    if (!cookieValue) {
        alert("[에러] Authorization 정보가 없습니다.\n관리자에게 문의하세요!");
        // deleteLoginInfo();
    }
}

const deleteLoginInfo = () => {

    localStorage.clear();
    window.location.href = "/Login";

}

