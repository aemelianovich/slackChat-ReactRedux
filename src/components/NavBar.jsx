// @ts-check

import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useUserContext } from './UserContext.jsx';

const NavBar = (props) => {
  const { user, setUser } = useUserContext();
  const { t } = useTranslation();

  const handleClick = (e) => {
    e.preventDefault();
    setUser(null);
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a
          className="navbar-brand"
          href="/"
          onClick={(e) => { e.preventDefault(); console.log('CLICK ON HEXLET CHAT'); location = e.target.href; }}
        >
          {t('navBar.title')}
        </a>
        { user ? (<Button variant="primary" onClick={handleClick}>{t('navBar.exit')}</Button>) : null}
      </div>
    </nav>
  );
};

export default NavBar;
