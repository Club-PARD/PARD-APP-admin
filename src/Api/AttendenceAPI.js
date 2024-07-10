import axios from "axios";
import { handleCheckCookie } from "./LoginService";

export const getAllAttendanceData = async (generationId) => {
    try {
        const response = await axios.get(
            "/v1/attendance/all/" + generationId,
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        alert("[에러] 전체 출석 정보 불러오기 실패!\n관리자에게 문의하세요!");
        handleCheckCookie();
    }
};

export const postAttendanceData = async (addUserInfo) => {
    try {
        const data = addUserInfo;
        const response = await axios.post(
            //  "https://we-pard.store/v1/users/login",
            "/v1/users",
            data
        );
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 출석 정보 추가하기 실패!\n관리자에게 문의하세요!");
        handleCheckCookie();
    }
};