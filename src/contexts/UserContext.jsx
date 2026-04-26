import { createContext, useEffect, useState } from "react";

export const User = createContext();

export default function UserProvider({ children }) {
  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null,
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null,
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null,
  );
  useEffect(() => {
    userToken
      ? localStorage.setItem("userToken", userToken)
      : localStorage.removeItem("userToken");
  }, [userToken]);

  useEffect(() => {
    userData
      ? localStorage.setItem("userData", JSON.stringify(userData))
      : localStorage.removeItem("userData");
  }, [userData]);

  useEffect(() => {
    userRole
      ? localStorage.setItem("userRole", userRole)
      : localStorage.removeItem("userRole");
  }, [userRole]);

  return (
    <User.Provider
      value={{
        userToken,
        setUserToken,
        userData,
        setUserData,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </User.Provider>
  );
}
