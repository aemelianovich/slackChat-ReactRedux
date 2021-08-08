// @ts-check

import React from 'react';
import { Container } from 'react-bootstrap';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import NoMatch from './NoMatch.jsx';
import NavBar from './NavBar.jsx';
import Chat from './Chat.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import UserContextProvider from './UserContext.jsx';
import SocketContextProvider from './SocketContext.jsx';

const App = () => (
  <BrowserRouter>
    <Container className="d-flex flex-column h-100">
      <UserContextProvider>
        <SocketContextProvider>
          <NavBar />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute exact path="/" component={Chat} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </SocketContextProvider>
      </UserContextProvider>
    </Container>
  </BrowserRouter>
);

export default App;
