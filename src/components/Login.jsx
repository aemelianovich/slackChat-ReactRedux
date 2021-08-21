// @ts-check

import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from './UserContext.jsx';
import routes from '../routes.js';
// @ts-ignore
import LoginChatImage from '../../assets/images/loginChat.jpg';

const Login = (props) => {
  const { setUser } = useUserContext();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={LoginChatImage} className="rounded-circle" alt={t('login.enter')} />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    const data = {
                      username: values.username,
                      password: values.password,
                    };

                    const response = await axios.post(
                      routes.loginPath(),
                      data,
                    );

                    setUser({ username: response.data.username, token: response.data.token });
                    props.history.push('/');
                  } catch (error) {
                    if (error.response) {
                      if (error.response.status === 401) {
                        setErrors({
                          username: ' ',
                          password: t('errors.password'),
                        });
                        rollbar.info('Login incorrect password', error);
                      } else {
                        setErrors({
                          username: ' ',
                          password: t('errors.generic'),
                        });
                        rollbar.error('Login Response', error);
                      }
                      console.error(error.response);
                    } else if (error.request) {
                      setErrors({
                        username: ' ',
                        password: t('errors.generic'),
                      });
                      console.error(error.request);
                    } else {
                      setErrors({
                        username: ' ',
                        password: t('errors.generic'),
                      });
                      rollbar.error('Login Request', error);
                      console.error(error);
                    }
                  }
                }}

              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                    <h1 className="text-center mb-4">{t('login.enter')}</h1>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        name="username"
                        autoComplete="username"
                        required
                        placeholder={t('login.username')}
                        id="username"
                        className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                      />
                      <label className="form-label" htmlFor="username">{t('login.username')}</label>
                    </div>
                    <div className="form-floating mb-4 form-group">
                      <Field
                        name="password"
                        autoComplete="current-password"
                        required
                        placeholder={t('login.password')}
                        type="password"
                        id="password"
                        className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                      />
                      <label className="form-label" htmlFor="password">{t('login.password')}</label>
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-100 mb-3 btn btn-outline-primary">{t('login.enter')}</button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.noUsername')}</span>
                {' '}
                <a href="/signup" role="link">{t('login.registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
