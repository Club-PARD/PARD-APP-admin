import axios from "axios";

export const getAllAttendanceData = async (generationId) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/v1/attendance/all/` + generationId,
            {withCredentials: true}
        );
        // console.log(response.data);
        return response.data;
    } catch (error) {
        alert("[에러] 전체 출석 정보 불러오기 실패!\n관리자에게 문의하세요!");
    }
};

export const postAttendanceData = async (addUserInfo) => {
    try {
        const data = addUserInfo;
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/v1/users`,
            data,
            {withCredentials: true}
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 출석 정보 추가하기 실패!\n관리자에게 문의하세요!");
    }
};