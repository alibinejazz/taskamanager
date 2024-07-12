import React, { useState } from "react";
import { Button, Spin } from "antd";
import ProjectList from "./ProjectList";
import PostProjectModal from "../Modals/PostProject";
import EditProjectModal from "../Modals/EditProjectModal";
import useFetchProjects from "../hooks/useFetchProjects";
import useEditProject from "../hooks/useEditProject";

const ProjectsAll = ({ isAdmin, user }) => {
  const [postProject, setPostProject] = useState(false);
  const [editProjectVisible, setEditProjectVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { projects, loading, setProjects, page, setPage } = useFetchProjects(isAdmin, user);
  const { editProject } = useEditProject();

  const handleCancelPostProject = () => setPostProject(false);
  const handleShowPostProject = () => setPostProject(true);

  const handleDeleteSuccess = (projectId) => {
    setProjects((prevProjects) =>
      Array.isArray(prevProjects)
        ? prevProjects.filter((project) => project.id !== projectId)
        : []
    );
  };

  const handleEditProjectSuccess = async (projectId, updatedData) => {
    try {
      const updatedProject = await editProject(projectId, updatedData);
      setProjects((prevProjects) =>
        Array.isArray(prevProjects)
          ? prevProjects.map((project) =>
              project.id === projectId ? updatedProject : project
            )
          : projects
      );
      setEditProjectVisible(false);
    } catch (error) {
      console.error("Failed to edit project", error);
    }
  };

  const handleEditProjectClick = (project) => {
    setSelectedProject(project);
    setEditProjectVisible(true);
  };



  if (loading) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  const handlePaginationClick = (url, increment) => {
    if (url) {
      setPage((prevPage) => prevPage + increment);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
      {isAdmin && <Button type="primary" onClick={handleShowPostProject} >Add New Project</Button>}

      </div>
    <div className="flex flex-wrap gap-2">
      <ProjectList
        projects={projects}
        onDeleteSuccess={handleDeleteSuccess}
        onEditClick={handleEditProjectClick}
        page={page}
        setPage={setPage}
        />
      <PostProjectModal
        visible={postProject}
        onCancel={handleCancelPostProject}
        />
      {selectedProject && (
        <EditProjectModal
        visible={editProjectVisible}
        onCancel={() => setEditProjectVisible(false)}
        project={selectedProject}
        onEditSuccess={handleEditProjectSuccess}
        />
      )}
    </div>
    <div className="mt-4 flex items-center justify-center">
    <Button
          type="primary"
          onClick={() =>
            handlePaginationClick(projects?.data?.prev_page_url, -1)
          }
          disabled={!projects?.data?.prev_page_url}
        >
          Previous
        </Button>
        <span className="mx-4">{`Page ${page}`}</span>
        <Button
          type="primary"
          onClick={() =>
            handlePaginationClick(projects?.data?.next_page_url, 1)
          }
          disabled={!projects?.data?.next_page_url}
        >
          Next
        </Button>
        </div>
    </div>
  );
};

export default ProjectsAll;
