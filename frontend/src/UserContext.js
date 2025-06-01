import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { uid } = useAuth();
  // console.log(uid);
  
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (uid) {
      fetch(`http://localhost:3300/api/users/getUser/${uid}`)
        .then(res => res.json())
        .then(data => setUserData(data.user))
        .catch(error => console.error("Fetch Error:", error)); 
    }
  }, [uid]);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
