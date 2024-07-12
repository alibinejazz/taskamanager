import React from "react";
import axios from "axios";
import { Modal, Button } from "antd";

const DeleteUser = ({ userId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://task-manager.codionslab.com/api/v1/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        onDeleteSuccess(userId);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this user?",
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

export default DeleteUser;
