// @ts-check

import React from 'react';
// @ts-ignore
import NoMatchImage from '../../assets/images/404Image.png';

const NoMatch = () => (
  <div className="container-fluid h-100">
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <a href="/" className="link">
          <img src={NoMatchImage} className="rounded-circle" alt="404 Error Code" />
        </a>
      </div>
    </div>
  </div>
);

export default NoMatch;
