import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import style from  "../assets/scss/Login.module.scss";
import AuthService from '../service/Auth';
import {useHistory,Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';
import { useEffect } from "react";
import Joi from "joi";
const schema = Joi.object({

    password: Joi.string()
        .required()
        // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
,
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})
export default function Login() {
    const history = useHistory();
    useEffect(()=>{
        const service = new AuthService();
        if(localStorage.getItem('key')){
            service.checkTocken().then(res=>{
                if(res.status){
                    history.push('/Home')
                }else{
                    localStorage.removeItem('key')
                }
            })
        }
    },[history])
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert,setAlert] = useState({
      show : false,
      type : '',
      message : ''
   })
  const service = new AuthService();
  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const  handleSubmit =async ( event) => {
    event.preventDefault();
    const formData = {
        email : email,
        password : password
    }
    const value = await schema.validate(formData);
    if(value.error){
        setAlert({
            show : true,
            type : 'danger',
            message : 'Please Check the Value '
        })
    }else{
        service.Login(formData).then(res=>{
            if(res.status){
                localStorage.setItem('key',res.token)
                history.push('/home')
            }else{
                setAlert({
                    show : true,
                    type : 'danger',
                    message : res.msg
                })
            }
        })
    }
  }
  const closeAlert = () =>{
      setAlert({
          show : false,
          type : '',
          message : ""
      })
  }
  return (
    <div className={style.Login}>
            <Form onSubmit={handleSubmit}>
                <h3>Sign In</h3>
                <Alert  variant={alert.type} show={alert.show} dismissible onClose={closeAlert}>
                    {alert.message}
                </Alert>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <Button type="submit" className="btn btn-primary btn-block" disabled={!validateForm()}>Submit</Button>
                <Link to="/register" className="pull-right">  SignUp</Link>
            </Form>
    </div>
  );
}