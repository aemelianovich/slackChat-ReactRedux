// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import NoMatchImage from '../../assets/images/404Image.png';

const NoMatch = () => (
  <div className="container-fluid h-100">
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <a href="/" className="link">
          <img
            src={NoMatchImage}
            className="rounded-circle"
            alt={useTranslation().t('noMatch.title')}
          />
        </a>
      </div>
    </div>
  </div>
);

export default NoMatch;
