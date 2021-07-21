// @ts-check

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// @ts-ignore
import SignUpImage from '../../assets/images/SignUpImage.jpg';

const SignUpSchema = Yup.object().shape({
    userName: Yup.string()
        .required('Обязательное поле')
        .min(6, 'От 3 до 20 символов!')
        .max(20, 'От 3 до 20 символов!'),
    password: Yup.string()
        .required('Обязательное поле') 
        .min(6, 'Не менее 6 символов!'),               
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Пароли должны совпадать"), 
});


export const SignUp = () => (
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
                                userName: '',
                                password: '',
                                confirmPassword: ''
                            }}
                            validationSchema={SignUpSchema}
                            onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 1));
                                alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            {({ isSubmitting, values, errors, touched }) => (
                                <Form className="w-50">
                                    <h1 className="text-center mb-4">Регистрация</h1>
                                    <div className="form-floating mb-3 form-group">
                                        <Field 
                                            placeholder="Имя Пользователя" 
                                            name="userName" 
                                            autoComplete="userName" 
                                            required id="userName" 
                                            className={'form-control' + (errors.userName && touched.userName ? ' is-invalid' : '')} 
                                        />                                        
                                        <ErrorMessage name="userName" component="div" className="invalid-feedback" />                                        
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
                                            className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}
                                            aria-autocomplete="list" 
                                        />
                                        <ErrorMessage name="password" component="div" className="invalid-feedback" />                                                                              
                                    </div>
                                    <div className="form-floating mb-4 form-group">
                                        <Field 
                                            placeholder="Подтвердите пароль" 
                                            name="confirmPassword" 
                                            required 
                                            autoComplete="new-password" 
                                            type="password" 
                                            id="confirmPassword" 
                                            className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')}
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />                                        
                                    </div>
                                    <button type="submit"  disabled={isSubmitting} className="w-100 btn btn-outline-primary">Зарегистрироваться</button>                                    
                                </Form>)}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
