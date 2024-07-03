import axios from "axios";

export const getAllUserData = async () => {
    try {
        const response = await axios.get(
            //  "https://we-pard.store/v1/users/login",
            "/v1/users",
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.log("get error");
        throw error;
    }
};


export const postUserData = async (addUserInfo) => {
    try {
        const data = addUserInfo;
        const response = await axios.post(
            //  "https://we-pard.store/v1/users/login",
            "/v1/users", data
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.log("get error");
        throw error;
    }
};