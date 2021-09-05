// @ts-check

import React from 'react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import image404 from '../../assets/images/image404.png';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <a href="/" className="link">
            <img
              src={image404}
              className="rounded-circle"
              alt={t('noMatch.title')}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page404;
