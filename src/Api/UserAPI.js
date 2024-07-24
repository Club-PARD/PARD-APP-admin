import axios from "axios";

export const getAllUserData = async (generationId) => {
    try {
        const response = await axios.get(
            "/v1/users/" + generationId,
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
            "/v1/users",
            data
        );
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 사용자 정보 추가하기 실패!\n관리자에게 문의하세요!");
    }
};


export const deleteUserData = async (userEmail) => {
    try {
        const response = await axios.delete(
            "/v1/users", {
            params: {
                email: userEmail
            }
        }
        );
        console.log(response);
    } catch (error) {
        alert("[에러] 사용자 정보 삭제하기 실패!\n관리자에게 문의하세요!");
    }
}