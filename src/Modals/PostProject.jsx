import React from "react";
import { Modal, Form, Input, Button, Alert } from "antd";
import usePostProject from "../hooks/usePostProject";
import useProfileData from "../hooks/userProfileData";

const PostProject = ({ visible, onCancel, onUpdate }) => {
  const { profileData } = useProfileData();
  const { formData, handleChange, postProject, loading, error } =
    usePostProject();

  const handleSubmit = async () => {
    await postProject(onUpdate, onCancel);
  };

  return (
    <Modal
      visible={visible}
      title="Add Project"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Post
        </Button>,
      ]}
    >
      {error && error.errors && Object.keys(error.errors).length > 0 && (
        <Alert
          message="Validation Error"
          description={Object.keys(error.errors).map((key) => (
            <p key={key}>{error.errors[key][0]}</p>
          ))}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      
      {profileData ? (
        <Form layout="vertical">
          <Form.Item
            label="Name"
            validateStatus={error && error.errors && error.errors.name ? "error" : ""}
            help={error && error.errors && error.errors.name ? error.errors.name[0] : ""}
          >
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Description"
            validateStatus={error && error.errors && error.errors.description ? "error" : ""}
            help={error && error.errors && error.errors.description ? error.errors.description[0] : ""}
          >
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      ) : (
        <p>Loading..</p>
      )}
    </Modal>
  );
};

export default PostProject;
