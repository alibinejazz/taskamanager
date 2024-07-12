import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Switch, message } from "antd";

const EditProjectModal = ({ visible, onCancel, project, onEditSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        is_active: project.is_active,
      });
    }
  }, [form, project]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onEditSuccess(project.id, values);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Edit Project"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          name: project.name,
          description: project.description,
          is_active: project.is_active,
        }}
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: "Please input the project name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please input the project description!" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="is_active"
          label="Is Active"
          valuePropName="checked"
        >
          <Switch defaultChecked={project.is_active} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
