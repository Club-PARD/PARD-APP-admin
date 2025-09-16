import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../fbase";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { de } from "date-fns/locale";


/*
- Google 로그인 코드
  - Google login을 통한 사용자 정보 조회
  - Firebase Firestore 조회
  - 운영진 유무 확인
*/


// Google 로그인 코드
export const handleGoogleLogin = async (navigate, selectedGeneration) => {

    if (selectedGeneration > 0)
        selectedGeneration = selectedGeneration;
    else
        selectedGeneration = 6;

    const provider = new GoogleAuthProvider();
    try {
        // Google login을 통한 사용자 정보 조회
        const data = await signInWithPopup(auth, provider);
        const user = data.user;
        const userEmail = user.email;
        
        // handleLoginAPI 호출 및 결과 출력
        const response = await handleLoginAPI(userEmail);
        if (response) {
            // console.log(user.displayName);
            // console.log(response);
            
            const decoded = jwtDecode(response);
            // console.log(decoded);
            if (decoded?.role === "ROLE_ADMIN") {
                alert("로그인되었습니다.");
                sessionStorage.setItem('selectedGeneration', selectedGeneration);
                localStorage.setItem("token", "pardo-admin-key");
                localStorage.setItem("userName", user.displayName);
                navigate("/");                
            } else {
                alert("등록된 사용자(운영진)만 사용 가능합니다.");
                window.location.reload();
            }

        } else {
            sessionStorage.removeItem();
            localStorage.removeItem();
        }

    } catch (err) {
        console.log(err);
    }
};

const handleLoginAPI = async (email) => {
    try {
        const response = await axios.post(
        `${process.env.REACT_APP_URL}/v1/users/login`,
        { email },
        { withCredentials: true }
        );
        
        return response.data;
    } catch (error) {
        console.log("login api error", error);
        if (error?.response?.status === 404) {
            alert("등록되지 않은 사용자 정보입니다.");
        } else if (error?.response?.status === 401) {
            alert("로그인에 실패했습니다! (추천 : 쿠키를 초기화하세요!)");
        }
        throw error;
    }
};


export const setupAxiosInterceptors = (navigate) => {
    axios
        .interceptors
        .response
        .use((response) => {
            // 정상 응답일 경우
            return response;
        }, (error) => {
            // 오류 응답일 경우
            if (error.response && error.response.status === 401) {
                // 401 오류 시 로그인 페이지로 이동
                localStorage.clear();
                navigate('/login');
            }
            return Promise.reject(error);
        });
};
