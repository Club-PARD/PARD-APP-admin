import axios from "axios";

export const getAllSchedulerData = async () => {
    try {
        const response = await axios.get(
            //  "https://we-pard.store/v1/users/login",
            "/v1/schedule",
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        console.log("get error");
        throw error;
    }
};


export const postScheduleData = async (addScheduleInfo) => {
    try {
        const data = addScheduleInfo;
        // const data = {
        //     title: "3차 과제",
        //     content: "인스타그 클론코딩 3차",
        //     part: "웹파트",
        //     date: "2024-07-20T19:46:39.654Z",
        //     contentsLocation: "",
        //     notice: false,
        //     remaingDay: 0,
        //     pastEvent: true
        // }
        const response = await axios.post(
            //  "https://we-pard.store/v1/users/login",
            "/v1/schedule", data
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        console.log("get error");
        throw error;
    }
};

export const deleteScheduleData = async (scheduleId) => {
    try {
        console.log("delete id : " + scheduleId);
        const response = await axios.delete(`/v1/schedule/11`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log("delete schedule error", error);
        return error;
    }
};
