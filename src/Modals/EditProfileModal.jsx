import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Switch } from 'antd';
import axios from 'axios';
import useProfileData from '../hooks/userProfileData';

const EditProfileModal = ({ visible, onCancel, user, onUpdate }) => {
  const { profileData, loading } = useProfileData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    is_active: false,
  });

  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        name: profileData.data.name,
        email: profileData.data.email,
        password: '',
        role: user?.data.user.role,
        is_active: profileData.data.is_active,
      });
    }
  }, [profileData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://task-manager.codionslab.com/api/v1/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User updated successfully:', response.data);
      onUpdate(response.data);
      onCancel();
    } catch (error) {
      console.error('Failed to update user:', error.response);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Edit Profile"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update
        </Button>,
      ]}
    >
      {loading ? (
        <p>Loading profile data...</p>
      ) : (
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Email">
            <Input name="email" value={formData.email} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Role">
            <Input name="role" value={formData.role} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Active">
            <Switch checked={formData.is_active} onChange={handleSwitchChange} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditProfileModal;
