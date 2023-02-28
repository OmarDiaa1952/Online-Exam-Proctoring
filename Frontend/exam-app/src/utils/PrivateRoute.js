import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import UserContext from "../store/user-context";

function PrivateRoute({ props, ...rest }) {
  let { user } = useContext(UserContext);
  return <Route {...rest}>{!user ? <Navigate to="/welcome" /> : props}</Route>;
}

export default PrivateRoute;