import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptors } from "../../Api/LoginService";

export const InterceptorSetup = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setupAxiosInterceptors(navigate);
    }, [navigate]);

    return null;
};
