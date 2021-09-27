// @ts-check

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(routeProps) => (user ? (
        <RouteComponent {...routeProps} />
      ) : (
        <Redirect to={routes.loginPagePath()} />
      ))}
    />
  );
};

export default PrivateRoute;
