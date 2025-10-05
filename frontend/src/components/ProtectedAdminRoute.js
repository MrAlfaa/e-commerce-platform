import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function ProtectedAdminRoute({ children, ...props }) {
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  if (!userInfo) {
    return <Redirect to="/signin?redirect=/admin" />;
  }

  if (!userInfo.isAdmin && !userInfo.isSuperUser) {
    return <Redirect to="/" />;
  }

  return children;
}

export default ProtectedAdminRoute;
