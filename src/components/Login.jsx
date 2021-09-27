// @ts-check

import React, {
  useContext, useRef, useEffect, useState,
} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext.jsx';
import routes from '../routes.js';
// @ts-ignore
import LoginChatImage from '../../assets/images/loginChat.jpg';

const Login = (props) => {
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const usernameRef = useRef(null);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  useEffect(() => {
    usernameRef.current?.focus();
  });

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
                onSubmit={async (values) => {
                  try {
                    const response = await axios.post(
                      routes.loginPath(),
                      values,
                    );

                    setUser({ username: response.data.username, token: response.data.token });
                    props.history.push(routes.chatPagePath());
                  } catch (error) {
                    usernameRef.current?.focus();
                    usernameRef.current?.select();
                    if (error.isAxiosError && error.response.status === 401) {
                      setAuthErrorMsg(t('errors.invalidCredentials'));
                      console.error(error.response);
                    } else {
                      setAuthErrorMsg(t('errors.generic'));
                      throw error;
                    }
                  }
                }}

              >
                {({
                  isSubmitting, errors, touched, handleChange, values, handleSubmit, handleBlur,
                }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">{t('login.enter')}</h1>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder={t('login.username')}
                        id="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          (!!touched.username && !!errors.username) || !!authErrorMsg
                        }
                        ref={usernameRef}
                      />
                      <Form.Label>{t('login.username')}</Form.Label>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        name="password"
                        autoComplete="current-password"
                        required
                        placeholder={t('login.password')}
                        type="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          (!!touched.password && !!errors.password) || !!authErrorMsg
                        }
                      />
                      <Form.Label>{t('login.password')}</Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.password || authErrorMsg}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant="outline-primary" disabled={isSubmitting} className="w-100 mb-3">{t('login.enter')}</Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.noUsername')}</span>
                {' '}
                <Link to={routes.signupPagePath()}>{t('login.registration')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
