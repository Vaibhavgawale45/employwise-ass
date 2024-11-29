import "./Login.css"; // Import the CSS file instead of SCSS
import { useState } from "react";
import makeApiCall from "../../api";
import { METHOD_TYPES } from "../../constants/app-constants";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { Button, Input, message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Log email and password to the console
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await makeApiCall(METHOD_TYPES.POST, API_ENDPOINTS.LOGIN_API, {
        email,
        password,
      });

      // Assuming response contains a token on success
      if (response.token) {
        message.success("Welcome back!");
        localStorage.setItem("authToken", response.token); // Save token to localStorage
        navigate("/Home"); // Navigate to the home page
      } else {
        message.error("Failed to login.");
      }
    } catch (err) {
      // Handle the error in the component (e.g., display a simple error message)
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
              const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
              if (loginDetails) {
                navigate("/Home");
              }
            }}
          >
            {/* <img src={logo} alt="Shopper Logo" /> */}
          </div>
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
            <Button className="btn__primary w-full" type="primary" htmlType="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
