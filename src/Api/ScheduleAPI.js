import axios from "axios";
import { handleCheckCookie } from "./LoginService";

export const getAllScheduleData = async () => {
    try {
        const response = await axios.get(
            //  "https://we-pard.store/v1/users/login",
            "/v1/schedule",
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 전체 일정 정보 불러오기 실패!\n관리자에게 문의하세요!");
        handleCheckCookie();
        throw error;
    }
};


export const postScheduleData = async (addScheduleInfo) => {
    try {
        const data = addScheduleInfo;
        const response = await axios.post(
            "/v1/schedule", data
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 일정 정보 추가하기 실패!\n관리자에게 문의하세요!");
        handleCheckCookie();
        throw error;
    }
};

export const deleteScheduleData = async (scheduleId) => {
    try {
        console.log("delete id : " + scheduleId);
        const response = await axios.delete
            (`/v1/schedule/${scheduleId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 일정 정보 삭제하기 실패!\n관리자에게 문의하세요!");
        handleCheckCookie();
        // throw error;
    }
};
