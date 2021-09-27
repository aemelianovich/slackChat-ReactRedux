// @ts-check

import React, {
  useContext, useRef, useEffect, useState,
} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import { UserContext } from '../contexts/UserContext.jsx';
// @ts-ignore
import SignUpImage from '../../assets/images/SignUpImage.jpg';

const SignUp = (props) => {
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const usernameRef = useRef(null);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  useEffect(() => {
    usernameRef.current?.focus();
  });

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
                onSubmit={async (values) => {
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
                    props.history.push(routes.chatPagePath());
                  } catch (error) {
                    usernameRef.current?.focus();
                    usernameRef.current?.select();
                    if (error.isAxiosError && error.response.status === 409) {
                      setAuthErrorMsg(t('errors.existingUser'));
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
                  <Form className="w-50" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        placeholder={t('signUp.username')}
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        id="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          (!!touched.username && !!errors.username) || !!authErrorMsg
                        }
                        ref={usernameRef}
                      />
                      <Form.Label htmlFor="username">{t('signUp.username')}</Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control
                        placeholder={t('signUp.password')}
                        name="password"
                        aria-describedby="passwordHelpBlock"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          (!!touched.password && !!errors.password) || !!authErrorMsg
                        }
                        aria-autocomplete="list"
                      />
                      <Form.Label htmlFor="password">{t('signUp.password')}</Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <Form.Control
                        placeholder={t('signUp.confirmPassword')}
                        name="confirmpassword"
                        required
                        autoComplete="new-password"
                        type="password"
                        id="confirmpassword"
                        value={values.confirmpassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          (!!touched.confirmpassword && !!errors.confirmpassword) || !!authErrorMsg
                        }
                      />
                      <Form.Label htmlFor="confirmpassword">{t('signUp.confirmPassword')}</Form.Label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.confirmpassword || authErrorMsg}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant="outline-primary" disabled={isSubmitting} className="w-100">
                      {t('signUp.register')}
                    </Button>
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
