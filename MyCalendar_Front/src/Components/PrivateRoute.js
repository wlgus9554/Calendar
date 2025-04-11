// components/PrivateRoute.js
import React from "react";
import RequireLogin from "./RequireLogin";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("loginEmail");
  return isLoggedIn ? children : <RequireLogin />;
};

export default PrivateRoute;
