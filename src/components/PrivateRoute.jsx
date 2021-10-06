// @ts-check

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={() => (user ? (
        <RouteComponent />
      ) : (
        <Redirect to={routes.loginPagePath()} />
      ))}
    />
  );
};

export default PrivateRoute;
