import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Pagination, Modal, Input, Button } from "antd";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { BASE_URL } from "../../constants/app-constants";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      message.warning("Session expired. Please log in again.");
      navigate("/");
      return;
    }

    getData(currentPage);
  }, [currentPage, navigate]);

  const getData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.GET_USER}?page=${page}`
      );
      if (response.status === 200) {
        setUsers(response.data.data);
        setTotalUsers(response.data.total);
      } else {
        message.error(response.data.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    message.success("Logged out successfully!");
    navigate("/");
  };

  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setIsEditing(true);
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `${BASE_URL}${API_ENDPOINTS.DELETE_USER}/${id}`
          );
          if (response.status === 200) {
            message.success("User deleted successfully!");
            getData(currentPage);
          } else {
            message.error(response.data.message || "Failed to delete user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Error deleting user.");
        }
      },
    });
  };

  const handleSaveChanges = async () => {
    if (!editUser?.first_name || !editUser?.last_name || !editUser?.email) {
      message.error("All fields are required.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.UPDATE_USER}/${editUser.id}`,
        editUser
      );
      if (response.status === 200) {
        message.success("User updated successfully!");
        setIsEditing(false);
        getData(currentPage);
      } else {
        message.error(response.data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Error updating user.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="user-list">
      <h1>User List</h1>

      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{ marginBottom: "20px", float: "right" }}
      >
        Logout
      </Button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <Button onClick={() => handleEditClick(user)} type="primary">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        current={currentPage}
        total={totalUsers}
        pageSize={6}
        onChange={handlePageChange}
        showSizeChanger={false}
        className="pagination-container"
      />

      <Modal
        title="Edit User"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={handleSaveChanges}
      >
        <div>
          <label>First Name</label>
          <Input
            name="first_name"
            value={editUser?.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <Input
            name="last_name"
            value={editUser?.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email</label>
          <Input
            name="email"
            value={editUser?.email}
            onChange={handleInputChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
