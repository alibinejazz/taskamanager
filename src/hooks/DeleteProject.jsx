import React from "react";
import axios from "axios";
import { Modal, Button } from "antd";

const DeleteProject = ({ projectId, onDeleteSuccess }) => {
  const handleDelete = async (e) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://task-manager.codionslab.com/api/v1/admin/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        onDeleteSuccess(projectId);
        alert("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const showDeleteConfirm = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this project?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete();
      },
      onCancel() {
        console.log("Delete canceled");
      },
    });
  };

  return (
    <Button
      className="text-red-500 hover:text-red-700"
      onClick={showDeleteConfirm}
    >
      Delete
    </Button>
  );
};

export default DeleteProject;
