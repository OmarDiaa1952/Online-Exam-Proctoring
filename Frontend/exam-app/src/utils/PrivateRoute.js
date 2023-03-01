import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import UserContext from "../store/user-context";

const PrivateRoute = () => {
  let { user } = useContext(UserContext);
  return !user ? <Navigate to="/welcome" /> : <Outlet />;
};

export default PrivateRoute;