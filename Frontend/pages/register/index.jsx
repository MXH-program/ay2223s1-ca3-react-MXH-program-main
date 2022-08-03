import { Button, Checkbox, Form, Input, message } from 'antd';
import React from 'react';
import {useNavigate, Link} from 'react-router-dom';
import './index.css';
import axios from 'axios';
import qs from 'qs';
import Title from '../../components/title/index';

const Register = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log('Success:', values);
    axios.post('http://localhost:3001/api/register', qs.stringify(values)).then(res => {
        console.log("res ", res)
        if(res.data.status === 'ok') {
            message.info("Register Successful!")
            navigate('/login')
        } else {
          message.info(res.data.data)
        }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login">
      <h3>Register</h3>
      <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        style={{marginBottom: '10px'}}
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <div style={{textAlign: 'right'}}>
        <Link to={"/login"}>Login Here</Link>
      </div>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Register;