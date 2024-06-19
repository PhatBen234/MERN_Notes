import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Modal from "react-modal";

Modal.setAppElement("#root");

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); 
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
