/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user/user.context";
import Message from "../message/message.component";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";

function ProtectRoute({ Component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function cheakAuthenication() {
      try {
        const response = await axios.get("http://localhost:8000/auth/check", {
          withCredentials: true,
        });
        const { data } = response;
        if (response.status === 200) {
          setIsAuthenticated(true);
          userContext.updateUser(data.data);
        }
      } catch (error) {
        console.error(error);
        setShowMessage(true);
        setIsAuthenticated(false);
      }
    }

    cheakAuthenication();
  }, []);

  return (
    <div>
      {isAuthenticated ? <Component /> : <LoadingSpinner />}
      {showMessage && (
        <Message
          type="error"
          message="Session Expired.Please Login to continue."
          onClose={() => {
            navigate("/signin", { replace: true });
          }}
        />
      )}
    </div>
  );
}

export default ProtectRoute;
