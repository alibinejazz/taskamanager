import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DeleteProject from "../hooks/DeleteProject";
import { Button, Modal, Input, Form, message, Table } from "antd";
import useAssignProject from "../hooks/useAssignProject";
import AuthContext from "../Context/AuthContext";

const ProjectList = ({
  projects,
  onDeleteSuccess,
  onEditClick,
}) => {
  const { isAdmin } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdsInput, setUserIdsInput] = useState("");
  const { assignProject, loading, error, success } = useAssignProject();
  const [projectIdToAssign, setProjectIdToAssign] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleAssignClick = (event, project) => {
    event.stopPropagation();
    setModalVisible(true);
    setProjectIdToAssign(project.id);
    setErrorMessage("");
  };

  const handleOk = async () => {
    try {
      const userIds = userIdsInput.split(",").map((id) => id.trim());
      await assignProject(projectIdToAssign, userIds);
      if (success) {
        message.success("Users assigned successfully");
        setUserIdsInput("");
        setModalVisible(false);
      } else {
        throw new Error("Failed to assign users");
      }
    } catch (error) {
      console.error("Failed to assign users", error);
      message.error("Failed to assign users");
    }
  };
  

  const handleCancel = () => {
    setModalVisible(false);
    setUserIdsInput("");
    setErrorMessage("");
  };

  const handleEditClick = (event, project) => {
    event.stopPropagation();
    onEditClick(project);
    setProjectIdToAssign(project.id);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}/tasks`);
  };

  const handleRowClick = (record) => {
    handleProjectClick(record.id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          className="project-name cursor-pointer"
          onClick={() => handleProjectClick(record.id)}
        >
          {text}
        </span>
      ),
      width: 300,
      className: "h-12",
      responsive: ['sm', 'md', 'lg', 'xl',"xs"]
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      className: "project-id h-12",
      width: 150,
      responsive: ['sm', 'md', 'lg', 'xl']
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      className: "project-description h-12",
      width: 400,
      responsive: ['sm', 'md', 'lg', 'xl']
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleDateString(),
      className: "project-created-at h-12",
      width: 250,
      responsive: ['sm', 'md', 'lg', 'xl']
    },
    ...(isAdmin
      ? [
          {
            title: "Assigned Users Count",
            key: "assigned_users_count",
            render: (text, record) => (
              <ul className="assigned-users-list h-12 overflow-auto">
                {record.users.map((user) => (
                  <li key={user.id} className="inline-block">
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            ),
            width: 350,
            responsive: ['sm', 'md', 'lg', 'xl']
          }
        ]
      : []),
   ...(isAdmin ? [{
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <span className="actions h-12">
        {isAdmin && (
          <>
            <Button onClick={(event) => handleEditClick(event, record)}>
              Edit
            </Button>
            <Button onClick={(event) => handleAssignClick(event, record)}>
              Assign Users
            </Button>
            <DeleteProject
              projectId={record.id}
              onDeleteSuccess={onDeleteSuccess}
            />
          </>
        )}
      </span>
    ),
    width: 400,
    responsive: ['sm', 'md', 'lg', 'xl',"xs"]
  }] : []) ,
  ];

  const data = projects?.data?.data.map((project) => ({
    key: project.id,
    name: project.name,
    id: project.id,
    description: project.description,
    created_at: project.created_at,
    users: project.users,
  }));

  const rowProps = (record) => ({
    onClick: () => handleRowClick(record),
  });

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={(record) => ({
          ...rowProps(record),
        })}
        scroll={{ x: true }}
        className="mt-2"
      />

      <Modal
        title={`Assign Users for Project ID: ${projectIdToAssign}`}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form.Item label="User IDs" validateStatus={error ? "error" : ""} help={error ? Object.values(error).flat().join(" ") : ""}>
          <Input
            value={userIdsInput}
            onChange={(e) => setUserIdsInput(e.target.value)}
            placeholder="Enter comma-separated user IDs"
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ProjectList;
