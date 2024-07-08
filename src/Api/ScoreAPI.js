import axios from "axios";

export const getAllScoreData = async () => {
    try {
        const response = await axios.get(
            "/v1/reason"
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error);
        throw error;
    }
};

export const postScoreData = async (addUserInfo) => {
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
        console.log("get error");
        throw error;
    }
};