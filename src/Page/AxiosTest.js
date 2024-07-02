import {useEffect, useState} from "react";
import axios from "axios";

function AxiosTest() {
    const [string, setString] = useState("before");
    const handlePostRequest = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_URL + "/test"
            );
            setString(response.data);
        } catch (error) {
            console.error('Error with Get request:', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const temp = await handlePostRequest();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {string}
            <br/>
            {/* <button onClick={() => fetchData2()}>hi/hi</button> */}
        </div>
    );
}
export default AxiosTest;