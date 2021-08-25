// @ts-check

import React from 'react';
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
import ChannelModal from './ChannelModal.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import UserContextProvider from './UserContext.jsx';

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <UserContextProvider>
        <ChannelModal />
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <PrivateRoute exact path="/" component={Chat} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </UserContextProvider>
    </div>
  </BrowserRouter>
);

export default App;
