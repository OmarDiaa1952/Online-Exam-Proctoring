import { createContext, useState } from "react";

const UserContext = createContext({
  type: "student",
  email: "student@email.com",
  setUserType: (type) => {},
  setEmail: (email) => {},
});

export function UserContextProvider(props) {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("student@email.com");

  function setUserTypeHandler(type) {
    setUserType(type);
  }
  function setEmailHandler(email) {
    setEmail(email);
  }

  const context = {
    type: userType,
    email: email,
    setUserType: setUserTypeHandler,
    setEmail: setEmailHandler,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
