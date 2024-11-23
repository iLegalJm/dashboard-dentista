import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return null;
};

export default Logout;