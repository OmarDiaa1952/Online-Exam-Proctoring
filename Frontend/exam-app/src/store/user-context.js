import { createContext, useState } from "react";

const UserContext = createContext({
  type: "student",
  setUserType: (type) => {},
  setEmail: (email) => {},
});

export function UserContextProvider(props) {
  const [user, setUser] = useState({
    type: "student",
    email: "student@email.com",
  });

  function setUserTypeHandler(type) {
    setUser((prevUser) => {
      return { ...prevUser, type: type };
    });
  }
  function setUserEmailHandler(email) {
    setUser((prevUser) => {
      return { ...prevUser, email: email };
    });
  }

  const context = {
    type: user,
    setUserType: setUserTypeHandler,
    setEmail: setUserEmailHandler,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
