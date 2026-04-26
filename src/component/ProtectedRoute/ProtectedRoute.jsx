import { useContext, useEffect } from "react";
import { User } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  const { userToken } = useContext(User);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  return userToken ? props.children : null;
}
