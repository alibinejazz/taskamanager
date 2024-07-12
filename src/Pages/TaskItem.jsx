import React from "react";

const TaskItem = ({ task, onClick }) => {
  return (
    <div
      className="mb-2 p-2 bg-white rounded-2xl shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-semibold">{task.name}</h3>
      <p>{task.description}</p>
      <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
    </div>
  );
};

export default TaskItem;
