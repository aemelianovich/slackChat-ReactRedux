// @ts-check

import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext.jsx';
import routes from '../routes.js';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();

  const handleClick = (e) => {
    e.preventDefault();
    setUser(null);
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={routes.chatPagePath()}>{t('navBar.title')}</Link>
        { user ? (<Button variant="primary" onClick={handleClick}>{t('navBar.exit')}</Button>) : null}
      </div>
    </nav>
  );
};

export default NavBar;
