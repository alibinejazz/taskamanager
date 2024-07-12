import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Switch } from "antd";
import useEditUser from "../hooks/useEditUser";

const EditUserModal = ({ visible, onCancel, user, onEditSuccess }) => {
  const [form] = Form.useForm();
  const { editUser, loading, error } = useEditUser(); 

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        is_active: user.is_active || false, 
      });
    }
  }, [form, user]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      editUser(user.id, values).then((updatedUser) => {
        onEditSuccess(user.id, updatedUser);
      });
    });
  };

  return (
    <Modal
      visible={visible}
      title="Edit User"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={loading}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the user's name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input the user's email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the user's role!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input the user's password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="is_active"
          label="Is Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
