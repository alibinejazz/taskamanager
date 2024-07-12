import React, { useContext, useState, useEffect } from "react";
import { Button, Spin } from "antd";
import AuthContext from "../Context/AuthContext";
import EditProfileModal from "../Modals/EditProfileModal";
import useProfileData from "../hooks/userProfileData";
import ProjectsAll from "./ProjectsAll";
import useAuthRedirect from "../hooks/useAuthRedirect";
import UserList from "./UserList";

const Dashboard = () => {
  const { user, logout, isAdmin, loading } = useContext(AuthContext);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // State to toggle between Users and Projects
  const { profileData } = useProfileData();
  const [profileName, setProfileName] = useState(""); // State to store profile name

  useAuthRedirect();

  useEffect(() => {
    if (profileData?.data?.name) {
      setProfileName(profileData.data.name);
    }
  }, [profileData]);

  const handleEditProfile = () => setEditProfileVisible(true);
  const handleCancelEditProfile = () => setEditProfileVisible(false);
  const handleUpdateUser = (updatedUser) => {
    console.log("User updated:", updatedUser);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-2xl font-bold">{!profileName ? ('Loading...') : (`Welcome, ${profileName}`)}</h1>
        <div className="flex items-center space-x-4">
          <h2 className="cursor-pointer text-lg" onClick={handleEditProfile}>
            Edit your profile
          </h2>
          <Button type="text" onClick={logout} className="text-white">
            Logout
          </Button>
        </div>
      </div>
      <EditProfileModal
        visible={editProfileVisible}
        onCancel={handleCancelEditProfile}
        user={user}
        onUpdate={handleUpdateUser}
      />
      <div className="flex justify-center my-4">
        {isAdmin && (
          <p
            className={`cursor-pointer mx-4 ${showUsers ? "text-blue-500" : ""}`}
            onClick={() => setShowUsers(true)}
          >
            Users
          </p>
        )}
        <p
          className={`cursor-pointer mx-4 ${!showUsers ? "text-blue-500" : ""}`}
          onClick={() => setShowUsers(false)}
        >
          Projects
        </p>
      </div>
      {showUsers && isAdmin ? <UserList /> : <ProjectsAll isAdmin={isAdmin} user={user} loading={loading} />}
    </div>
  );
};

export default Dashboard;
