import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Input, message } from "antd";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { BASE_URL } from "../../constants/app-constants"
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.LOGIN_API}`, {
        email,
        password,
      });

      if (response.data.token) {
        message.success("Welcome back!");
        localStorage.setItem("Token", response.data.token); 
        navigate("/userlist");
      } else {
        message.error("Failed to login.");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      message.error("Failed to login.");
    }
  };

  return (
    <div className="auth__page">
      <div className="auth__wrapper">
        <div className="auth__header">
          <div
            className="logo"
            onClick={() => {
              const loginDetails = JSON.parse(
                localStorage.getItem("loginDetails")
              );
              if (loginDetails) {
                navigate("/Home");
              }
            }}
          ></div>
          <div className="auth__header_title">Welcome back</div>
        </div>
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="input_grp">
            <Input
              size="large"
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input_grp">
            <Input.Password
              size="large"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth__action_primary">
            <Button
              className="btn__primary w-full"
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
