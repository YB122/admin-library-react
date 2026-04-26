import { useContext } from "react";
import { User } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const { userToken } = useContext(User);

  if (userToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
