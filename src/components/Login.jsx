// @ts-check

import React from 'react';
import { Formik, Form, Field } from 'formik';
// @ts-ignore
import LoginChatImage from '../../assets/images/loginChat.jpg';

export const Login = () => (
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
                                userName: '',
                                password: ''
                            }}
                            onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 1));
                                alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            {({ isSubmitting, values }) => (
                                <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                                    <h1 className="text-center mb-4">Войти</h1>
                                    <div className="form-floating mb-3 form-group">
                                        <Field name="userName" autoComplete="userName" required placeholder="Ваш ник" id="userName" className="form-control"/>                                       
                                    </div>
                                    <div className="form-floating mb-4 form-group">
                                        <Field name="password" autoComplete="current-password" required placeholder="Пароль" type="password" id="password" className="form-control" />                                        
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-100 mb-3 btn btn-outline-primary">Войти</button>                                    
                                </Form>
                            )}
                            
                        </Formik>
                    </div>
                    <div className="card-footer p-4">
                        <div className="text-center"><span>Нет аккаунта?</span> <a href="/signup">Регистрация</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
