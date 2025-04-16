import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
    );

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
    }, [authTokens]);

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", { username, password });
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem("authTokens", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error en inicio de sesión:", error);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
