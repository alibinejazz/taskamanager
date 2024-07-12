import React, { useContext, useState } from 'react';
import { Form, Input, Button } from 'antd';
import AuthContext from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const { register, loading } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setFormLoading(true);
      await register(values);
    } catch (error) {
    } finally {
      setFormLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Enter your name" className="border border-gray-300 rounded px-4 py-2 w-full" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
          >
            <Input placeholder="Enter your email" className="border border-gray-300 rounded px-4 py-2 w-full" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password placeholder="Enter your password" className="border border-gray-300 rounded px-4 py-2 w-full" />
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" loading={formLoading || loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Register
            </Button>
          </Form.Item>
          <div className="text-right mt-4">
            <h4
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </h4>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
