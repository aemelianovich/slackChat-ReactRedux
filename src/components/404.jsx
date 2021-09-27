// @ts-check

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import image404 from '../../assets/images/image404.png';
import routes from '../routes.js';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <Link to={routes.chatPagePath()} className="link">
            <img
              src={image404}
              className="rounded-circle"
              alt={t('noMatch.title')}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page404;
