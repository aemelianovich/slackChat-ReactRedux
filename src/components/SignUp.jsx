// @ts-check

import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import { useUserContext } from './UserContext.jsx';
// @ts-ignore
import SignUpImage from '../../assets/images/SignUpImage.jpg';

const SignUp = (props) => {
  const { setUser } = useUserContext();
  const { t } = useTranslation();

  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('signUp.requiredField'))
      .min(3, t('signUp.usernameLength'))
      .max(20, t('signUp.usernameLength')),
    password: Yup.string()
      .required(t('signUp.requiredField'))
      .min(6, t('signUp.passwordLength')),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('signUp.identicalPassword')),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={SignUpImage} className="rounded-circle" alt={t('signUp.title')} />
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
                          confirmpassword: t('errors.existingUser'),
                        });
                      } else {
                        setErrors({
                          username: ' ',
                          password: ' ',
                          confirmpassword: t('errors.generic'),
                        });
                      }
                      console.error(error.response);
                    } else if (error.request) {
                      setErrors({
                        username: ' ',
                        password: ' ',
                        confirmpassword: t('errors.generic'),
                      });
                      console.error(error.request);
                    } else {
                      setErrors({
                        username: ' ',
                        password: ' ',
                        confirmpassword: t('errors.generic'),
                      });

                      console.error(error);
                    }
                  }
                }}
              >
                {({
                  isSubmitting, errors, touched,
                }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        placeholder={t('signUp.username')}
                        name="username"
                        autoComplete="username"
                        required
                        id="username"
                        className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                      />
                      <label className="form-label" htmlFor="username">{t('signUp.username')}</label>
                      <ErrorMessage name="username" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-floating mb-3 form-group">
                      <Field
                        placeholder={t('signUp.password')}
                        name="password"
                        aria-describedby="passwordHelpBlock"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="password"
                        className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                        aria-autocomplete="list"
                      />
                      <label className="form-label" htmlFor="password">{t('signUp.password')}</label>
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-floating mb-4 form-group">
                      <Field
                        placeholder={t('signUp.confirmPassword')}
                        name="confirmpassword"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="confirmpassword"
                        className={`form-control${errors.confirmpassword && touched.confirmpassword ? ' is-invalid' : ''}`}
                      />
                      <label className="form-label" htmlFor="confirmpassword">{t('signUp.confirmPassword')}</label>
                      <ErrorMessage name="confirmpassword" component="div" className="invalid-feedback" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-100 btn btn-outline-primary">
                      {t('signUp.register')}
                    </button>
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
