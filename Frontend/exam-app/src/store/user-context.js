import { createContext, useState } from "react";

const UserContext = createContext({
  type: "student",
  setUserType: (type) => {},
});

export function UserContextProvider(props) {
  const [userType, setUserType] = useState("student");

  function setUserTypeHandler(type) {
    setUserType(type);
  }

  const context = {
    type: userType,
    setUserType: setUserTypeHandler,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
