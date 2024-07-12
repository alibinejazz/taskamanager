import React, { useContext } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const Login = () => {
  const { login, loginError } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    await login(values); 
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-lg">
        {loginError && (
          <Alert
            message="Login Error"
            description={loginError.message || "An error occurred during login."}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          labelCol={{ span: 3 }}
          initialValues={{ remember: true }}
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input className="border border-gray-300 rounded px-4 py-2 w-full" />
          </Form.Item>

          <Form.Item
            label="Pass"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="border border-gray-300 rounded px-4 py-2 w-full" />
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Login
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <h4
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register Yourself
            </h4>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
