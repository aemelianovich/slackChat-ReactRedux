// @ts-check

import React, { useContext } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes.js';
import { UserContext } from './UserContext.jsx';
// @ts-ignore
import SignUpImage from '../../assets/images/SignUpImage.jpg';

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(6, 'От 3 до 20 символов!')
    .max(20, 'От 3 до 20 символов!'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов!'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
});

const SignUp = (props) => {
  const { setUser } = useContext(UserContext);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={SignUpImage} className="rounded-circle" alt="Регистрация" />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmpassword: '',
                }}
                validationSchema={SignUpSchema}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    const data = {
                      username: values.username,
                      password: values.password,
                    };

                    const response = await axios.post(
                      routes.signupPath(),
                      data,
                    );

                    // alert(JSON.stringify(response, null, 2));
                    setUser({ username: response.data.username, token: response.data.token });
                    props.history.push('/');
                  } catch (error) {
                    if (error.response) {
                      if (error.response.status === 409) {
                        setErrors({
                          username: ' ',
                          password: ' ',
                          confirmpassword: 'Такой пользователь уже существует',
                        });
                      } else {
                        setErrors({
                          username: ' ',
                          password: ' ',
                          confirmpassword: 'Свяжитесь с администратором',
                        });
                      }
                      console.log(error.response);
                    } else if (error.request) {
                      setErrors({
                        username: ' ',
                        password: ' ',
                        confirmpassword: 'Свяжитесь с администратором',
                      });
                      console.log(error.request);
                    } else {
                      setErrors({
                        username: ' ',
                        password: ' ',
                        confirmpassword: 'Свяжитесь с администратором',
                      });

                      console.log(error);
                    }
                  }
                }}
              >
                {({
                  isSubmitting, errors, touched,
                }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        placeholder="Имя Пользователя"
                        name="username"
                        autoComplete="username"
                        required
                        id="username"
                        className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                      />
                      <ErrorMessage name="username" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        placeholder="Пароль"
                        name="password"
                        aria-describedby="passwordHelpBlock"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="password"
                        className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                        aria-autocomplete="list"
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-floating mb-4 form-group">
                      <Field
                        placeholder="Подтвердите пароль"
                        name="confirmpassword"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="confirmpassword"
                        className={`form-control${errors.confirmpassword && touched.confirmpassword ? ' is-invalid' : ''}`}
                      />
                      <ErrorMessage name="confirmpassword" component="div" className="invalid-feedback" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-100 btn btn-outline-primary">Зарегистрироваться</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
