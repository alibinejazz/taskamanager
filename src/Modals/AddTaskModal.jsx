import React from "react";
import { Modal, Form, Input, DatePicker, Select, message} from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const AddTaskModal = ({ projectId, visible, onCancel, refetchTasks }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    try {
      const values = await form.validateFields();
      await axios.post(
        `https://task-manager.codionslab.com/api/v1/project/${projectId}/task`,
        {
          ...values,
          due_date: values.due_date
            ? values.due_date.format("YYYY-MM-DD")
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Task added successfully");
      onCancel(); // Close modal after successful addition
      refetchTasks(); // Refetch tasks in parent component
    } catch (err) {
      console.error("Error adding task:", err);
      message.error("Failed to add task");
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields on cancel
    onCancel();
  };

  return (
    <>
    <Modal
      title="Add New Task"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Task Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the task name" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter the task description",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[
            { required: true, message: "Please select the due date" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select the status" }]}
        >
          <Select>
            <Option value="todo">todo</Option>
            <Option value="in-progress">in-progress</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};

export default AddTaskModal;
