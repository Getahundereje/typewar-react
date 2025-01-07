import { createContext, useState } from "react";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  const [user, setUser] = useState();

  const updateUser = (newuser) => setUser(newuser);
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
