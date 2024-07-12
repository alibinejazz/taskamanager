import React from "react";
import TaskItem from "./TaskItem";

const TaskColumn = ({ tasks, status, showModal }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md h-[800px] overflow-auto">
      <h2 className="font-bold mb-2 text-center">{status}</h2>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskItem key={task.id} task={task} onClick={() => showModal(task.id)} />
        ))}
    </div>
  );
};

export default TaskColumn;
