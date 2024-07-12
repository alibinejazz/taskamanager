import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Form, Input, Select, message, Button } from "antd";
import useFetchTasks from "../hooks/useFetchTasks";
import axios from "axios";
import TaskColumn from "./TaskColumn";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const Progress = () => {
  const { id } = useParams();
  const { tasks, loading, error, refetchTasks } = useFetchTasks(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  
  useEffect(() => {
    if (selectedTask) {
      fetchComments(selectedTask.id);
    }
  }, [selectedTask]);

  const fetchComments = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://task-manager.codionslab.com/api/v1/project/${id}/task/${taskId}/comment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const showModal = async (taskId = null) => {
    if (taskId) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `https://task-manager.codionslab.com/api/v1/project/${id}/task/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedTask(response.data.data);
        form.setFieldsValue({
          name: response.data.data.name,
          description: response.data.data.description,
          due_date: response.data.data.due_date
            ? moment(response.data.data.due_date).format("YYYY-MM-DD")
            : null,
          status: response.data.data.status,
        });
        fetchComments(response.data.data.id); // Fetch comments for the selected task
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    } else {
      form.resetFields();
      setIsNewTask(true);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    const values = form.getFieldsValue();

    try {
      if (isNewTask) {
        await axios.post(
          `https://task-manager.codionslab.com/api/v1/project/${id}/task`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("Task added successfully");
      } else {
        await axios.put(
          `https://task-manager.codionslab.com/api/v1/project/${id}/task/${selectedTask.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        message.success("Task updated successfully");
      }
      setIsModalVisible(false);
      setSelectedTask(null);
      setIsNewTask(false);
      refetchTasks();
    } catch (err) {
      console.error("Error saving task details:", err);
    }
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://task-manager.codionslab.com/api/v1/project/${id}/task/${selectedTask.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Task deleted successfully");
      setIsModalVisible(false);
      setSelectedTask(null);
      refetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://task-manager.codionslab.com/api/v1/project/${id}/task/${selectedTask.id}/comment/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Comment updated successfully");
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: updatedContent, editable: false }
          : comment
      );
      setComments(updatedComments);
    } catch (err) {
      console.error("Error updating comment:", err);
      message.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://task-manager.codionslab.com/api/v1/project/${id}/task/${selectedTask.id}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Comment deleted successfully");
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (err) {
      console.error("Error deleting comment:", err);
      message.error("Failed to delete comment");
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://task-manager.codionslab.com/api/v1/project/${id}/task/${selectedTask.id}/comment`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.data]);
      setNewComment("");
      message.success("Comment added successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      message.error("Failed to add comment");
    }
  };

  const toggleEditComment = (commentId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, editable: !comment.editable }
        : comment
    );
    setComments(updatedComments);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
    setIsNewTask(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <TaskColumn tasks={tasks} status="todo" showModal={showModal} />
        <TaskColumn tasks={tasks} status="in-progress" showModal={showModal} />
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="font-bold mb-2 text-center">Testing</h2>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="font-bold mb-2 text-center">Done</h2>
        </div>
      </div>
      <Button className="w-full" type="primary" onClick={() => showModal()}>
        Add Task
      </Button>
      <Modal
        title={isNewTask ? "Add Task" : "Task Details"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          !isNewTask && (
            <Button
              key="delete"
              type="text"
              className="text-red-500 border-red-700 border-sm"
              onClick={handleDeleteTask}
            >
              Delete This Task
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Please enter the task name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the task description" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="due_date"
            rules={[{ required: true, message: "Please select the due date" }]}
          >
            <Input type="date" />
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
        <h3>Comments:</h3>
<ul className="p-2">
  {comments.map((comment) => (
    <li key={comment.id} className=" shadow-md">
      {comment.editable ? (
        <Input
          defaultValue={comment.content}
          onChange={(e) => {
            const updatedContent = e.target.value;
            const updatedComments = comments.map((c) =>
              c.id === comment.id ? { ...c, content: updatedContent } : c
            );
            setComments(updatedComments);
          }}
        />
      ) : (
        <span>{comment.content}</span>
      )}
      {comment.editable ? (
        <div className="flex justify-end items-end">
          <Button
            onClick={() => handleEditComment(comment.id, comment.content)}
          >
            Save
          </Button>
          <Button
            onClick={() => toggleEditComment(comment.id)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex justify-end items-end">
          <Button onClick={() => toggleEditComment(comment.id)}>
            {comment.editable ? "Cancel" : "Edit"}
          </Button>
          <Button onClick={() => handleDeleteComment(comment.id)}>
            Delete
          </Button>
        </div>
      )}
    </li>
  ))}
</ul>
        <Input
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="primary" onClick={handleAddComment} className="mt-2">
          Add Comment
        </Button>
      </Modal>
    </div>
  );
};

export default Progress;
