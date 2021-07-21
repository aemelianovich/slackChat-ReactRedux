// @ts-check

import React from "react";
import {  
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Login } from './Login.jsx';
import { SignUp } from './SignUp.jsx';
import { NoMatch } from './NoMatch.jsx';
import { NavBar } from './NavBar.jsx';

export const App = () => {
  return (
    <div className="d-flex flex-column h-100">
      <NavBar/>
      <Switch>
        <Redirect exact from="/" to="/login" />  
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="*">
            <NoMatch />
          </Route>        
      </Switch>
    </div>
  );
}