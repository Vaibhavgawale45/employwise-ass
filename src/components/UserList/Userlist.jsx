import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { message } from "antd";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // Using fetch to get data
      const response = await fetch(`${API_ENDPOINTS.GET_USER}`);
      const data = await response.json(); // Parse the response as JSON
      console.log(data);
      if (response.ok) {
        console.log(data);
        setUsers(data.data);
      } else {
        // Handle unsuccessful response
        message.error(data.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data.");
    }
  };

  return (
    <div className="user-list">
      <h1>User List</h1>
      <div className="user-list-container">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <h2>
              {user.first_name} {user.last_name}
            </h2>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
