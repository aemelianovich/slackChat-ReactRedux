// @ts-check

import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { UserContext } from './UserContext.jsx';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleClick = (e) => {
    e.preventDefault();
    setUser(null);
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        { user ? (<Button variant="primary" onClick={handleClick}>Выйти</Button>) : null}
      </div>
    </nav>
  );
};

export default NavBar;
