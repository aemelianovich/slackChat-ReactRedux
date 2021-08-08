// @ts-check

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from './UserContext.jsx';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user } = useUserContext();

  return (
    <Route
      {...rest}
      render={(routeProps) => (user ? (
        <RouteComponent {...routeProps} />
      ) : (
        <Redirect to="/login" />
      ))}
    />
  );
};

export default PrivateRoute;
