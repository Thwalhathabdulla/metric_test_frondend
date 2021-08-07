import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import style from  "../assets/scss/Login.module.scss";
import AuthService from '../service/Auth';
import {useHistory,Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap'
import Joi from "joi";
const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    confirmPassword: Joi.ref('password'),

    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),


    number: [
        Joi.string(),
        Joi.number().required(),
    ]
})
  
export default function Register() {
    const history = useHistory();
    const [state,setState] = useState({
        name : '',
        email : '',
        number : "",
        password : "",
        confirmPassword: "",
        alert : {
            show : false,
            type : '',
            message : ''
        }
    })
  const service = new AuthService();
  function validateForm() {
    return state.email.length > 0 && state.password.length > 0&& state.name.length > 0&& state.number.length > 0;
  }

  const  handleSubmit =async (event) => {
    event.preventDefault();
    const FormData ={
        name : state.name,
        email : state.email,
        number : state.number,
        password : state.password,
        confirmPassword : state.confirmPassword
    };
    const value = await schema.validate(FormData);
    if(value.error){
        console.log('here');
        setState(prev=>({
            ...prev,
            alert : {
                show : true,
                type : 'danger',
                message : 'Please Check the value ' 
            }
        }))
    }else{
        service.register(FormData).then(res=>{
            if(res.status){
                history.push('/login')
            }else{
                setState(prev=>({
                    ...prev,
                    alert : {
                        show : true,
                        type : 'danger',
                        message : res.msg 
                    }
                }))
            }
        })
    }
  }
const changeHandler = e=>{
    const {name,value} = e.target;
    setState(prev=>({
        ...prev,
        [name] : value
    }))
}
const closeAlert = () =>{
    setState(prev=>({
        ...prev,
        alert : {
            show : false,
            type : '',
            message : ""
        }
    }))
}
  return (
    <div className={style.Login}>
            <Form onSubmit={handleSubmit}>
                <Alert  variant={state.alert.type} show={state.alert.show} dismissible onClose={closeAlert}>
                    {state.alert.message}
                </Alert>
                <h3>Sign In</h3>
                <Form.Group size="lg" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        name="name"
                        value={state.name}
                        placeholder="Enter Name"
                        onChange={changeHandler}
                        required
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={state.email}
                        placeholder="Enter Email"
                        onChange={changeHandler}
                        required
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="number">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="number"
                        value={state.number}
                        name="number"
                        placeholder="Enter Mobile Number"
                        onChange={changeHandler}
                        required
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={state.password}
                        placeholder="Enter password"
                        name="password"
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="confirmPassword">
                    <Form.Label>confirmPassword</Form.Label>
                    <Form.Control
                        type="password"
                        value={state.confirmPassword}
                        placeholder="Enter confirmPassword"
                        name="confirmPassword"
                        onChange={changeHandler}
                    />
                </Form.Group>

                <Button type="submit" className="btn btn-primary btn-block" disabled={!validateForm()}>Submit</Button>
                <Link to="/login" className="pull-right">  SignIn</Link>
            </Form>
    </div>
  );
}