import { createContext, useState, useContext} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [uid, setUid] = useState(localStorage.getItem("uid") || "");

    return (
        <AuthContext.Provider value={{ uid, setUid }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}