import axios from "axios";

export const getAllScoreData = async () => {
    try {
        const response = await axios.get(
            "/v1/reason"
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        alert("[에러] 전체 점수 불러오기 실패!\n관리자에게 문의하세요!");
    }
};


export const getSelectedUserScoreData = async (email) => {
    try {
        console.log("email", email);
        const response = await axios.get(
            "/v1/reason/admin", {
                params: {
                    email: email,
                }
            }
        );
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 선택한 사용자 점수 정보 불러오기 실패!\n관리자에게 문의하세요!");
    }
}


export const postScoreData = async (addScoreInfo) => {
    try {
        const data = addScoreInfo;
        const response = await axios.post(
            "/v1/reason",
            data
        );
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 점수 정보 추가하기 실패!\n관리자에게 문의하세요!");
    }
};


export const deleteScoreData = async (reasonId) => {
    try {
        const response = await axios.delete("/v1/reason", {
            data: {
                reasonId: reasonId
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 점수 정보 삭제하기 실패!\n관리자에게 문의하세요!");
    }
};

export const getRankingInfo = async () => {
    try {
        const response = await axios.get("/v1/rank/total");
        return response.data;
    }catch (error) {
        alert("[에러] 전체 랭킹 점수 불러오기 실패!\n관리자에게 문의하세요!");
    }
}