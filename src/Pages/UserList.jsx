import React, { useState } from 'react';
import { Button, Spin, Modal, Form, Input, message, Table } from 'antd';
import useFetchUsers from '../hooks/useFetchUsers';
import useAddUser from '../hooks/useAddUser';
import EditUserModal from '../Modals/EditUserModal'; // Adjust the import path as necessary
import DeleteUser from '../hooks/DeleteUser';

const UserList = ({ token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { users, loading, error, setUsers } = useFetchUsers(true, currentPage);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { addUser, loading: adding, error: addError } = useAddUser();

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleEditSuccess = (userId, updatedUser) => {
    setUsers((prevUsers) =>
      Array.isArray(prevUsers.data.data)
        ? {
            ...prevUsers,
            data: {
              ...prevUsers.data,
              data: prevUsers.data.data.map((user) => (user.id === userId ? updatedUser : user)),
            },
          }
        : users
    );
    setEditModalVisible(false);
    message.success('User updated successfully');
  };

  const handleAddClick = () => {
    setAddModalVisible(true);
  };

  const handleAddUser = async (values) => {
    try {
      const response = await addUser(values, token);
      const newUser = response.data;
      setUsers((prevUsers) =>
        Array.isArray(prevUsers.data.data)
          ? {
              ...prevUsers,
              data: {
                ...prevUsers.data,
                data: [newUser, ...prevUsers.data.data],
              },
            }
          : users
      );
      setAddModalVisible(false);
      message.success('User added successfully');
    } catch (err) {
      message.error('Failed to add user');
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return <Spin size="large" className="flex items-center justify-center h-screen" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width:200
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width:220
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button onClick={() => handleEditClick(user)}>Edit</Button>
          <DeleteUser userId={user.id} />
        </span>
      ),
      width:300
    },
  ];
  return (
    <div>
      <div className='flex justify-center'>
      <Button onClick={handleAddClick} type='primary'>Add User</Button>
      </div>
      <Table
      dataSource={users?.data?.data}
      columns={columns}
      rowKey="id"
      scroll={{ x: '100%' }} 
      className="mt-2"
      responsive={{
        md: true,
        xs: true,
        xl: true,
        lg: true,
        sm: true,
      }}
    />
      <div className="mt-4 flex items-center justify-center">
        <Button type="primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="mx-4">{`Page ${currentPage}`}</span>
        <Button type="primary" onClick={handleNextPage} disabled={users?.data?.data?.length === 0}>
          Next
        </Button>
      </div>
      {selectedUser && (
        <EditUserModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          user={selectedUser}
          onEditSuccess={handleEditSuccess}
        />
      )}
      <Modal
        visible={addModalVisible}
        title="Add User"
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddUser} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter the email' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter the password' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter the role' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={adding}>
              Add User
            </Button>
          </Form.Item>
        </Form>
        {addError && <div style={{ color: 'red' }}>Error: {addError.message}</div>}
      </Modal>
    </div>
  );
};

export default UserList;
