// @ts-check

import React, { useContext } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import axios from 'axios';
import { UserContext } from './UserContext.jsx';
import routes from '../routes.js';
// @ts-ignore
import LoginChatImage from '../../assets/images/loginChat.jpg';

const Login = (props) => {
  const { setUser } = useContext(UserContext);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={LoginChatImage} className="rounded-circle" alt="Войти" />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    // await new Promise((r) => setTimeout(r, 1));
                    const data = {
                      username: values.username,
                      password: values.password,
                    };

                    const response = await axios.post(
                      routes.loginPath(),
                      data,
                    );

                    // alert(JSON.stringify(response, null, 2));
                    setUser({ username: response.data.username, token: response.data.token });
                    props.history.push('/');
                  } catch (error) {
                    setErrors({ username: 'Неверное имя пользователя или пароль', password: 'Неверное имя пользователя или пароль' });
                    // alert(JSON.stringify(error, null, 2));
                    console.log(error);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                    <h1 className="text-center mb-4">Войти</h1>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        name="username"
                        autoComplete="username"
                        required
                        placeholder="Ваш ник"
                        id="username"
                        className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                      />
                    </div>
                    <div className="form-floating mb-4 form-group">
                      <Field
                        name="password"
                        autoComplete="current-password"
                        required
                        placeholder="Пароль"
                        type="password"
                        id="password"
                        className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                {' '}
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;