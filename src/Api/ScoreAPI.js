import axios from "axios";

export const getAllScoreData = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/v1/reason`,
            {withCredentials: true}
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
            `${process.env.REACT_APP_URL}/v1/reason/admin`,
            {
                params: {
                    email: email
                },
                withCredentials: true
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
            `${process.env.REACT_APP_URL}/v1/reason`,
            data,
            {withCredentials: true}
        );
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 점수 정보 추가하기 실패!\n관리자에게 문의하세요!");
    }
};

export const deleteScoreData = async (reasonId) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_URL}/v1/reason`, {
            data: {
                reasonId: reasonId
            },
            withCredentials: true
        });
        console.log(response);
        return response.data;
    } catch (error) {
        alert("[에러] 점수 정보 삭제하기 실패!\n관리자에게 문의하세요!");
    }
};

export const getRankingInfo = async (generationId) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/v1/rank/total?generation=` + generationId,
            { withCredentials: true },
            // {
            //     params: {
            //         generation : generationId
            //     }
            // }
        );
        return response.data;
    } catch (error) {
        alert("[에러] 전체 랭킹 점수 불러오기 실패!\n관리자에게 문의하세요!");
    }
}