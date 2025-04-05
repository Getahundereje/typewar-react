import { createContext, useState } from "react";
import useSessionStorage from "../../hooks/useSessionStorage";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [, setPlayerState] = useSessionStorage("playerState", "");

  function updateUser(newUser) {
    if (!user) {
      console.log("k=hell");
      setPlayerState(newUser.playerState);
      setUser(newUser);
    }
  }
  const UserContextValue = {
    user,
    updateUser,
  };

  return (
    <UserContext.Provider value={UserContextValue}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
