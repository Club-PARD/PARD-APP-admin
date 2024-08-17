import axios from "axios";

export const getAllUserData = async (generationId) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/v1/users/` + generationId,
            {withCredentials: true}
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 전체 사용자 정보 불러오기 실패!\n관리자에게 문의하세요!");
    }
};

export const postUserData = async (addUserInfo) => {
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
        alert("[에러] 사용자 정보 추가하기 실패!\n관리자에게 문의하세요!");
        return false;
    }
};

export const deleteUserData = async (userEmail) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_URL}/v1/users`, {
            params: {
                email: userEmail
            },
            withCredentials: true
        });
        // console.log(response);
    } catch (error) {
        alert("[에러] 사용자 정보 삭제하기 실패!\n관리자에게 문의하세요!");
    }
}