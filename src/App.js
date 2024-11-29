import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login/Login";
import UserList from "./components/UserList/Userlist";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/userlist" element={<UserList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
