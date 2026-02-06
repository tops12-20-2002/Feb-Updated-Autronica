import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./Style.css";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import RoleSelectPage from "./Pages/RoleSelectPage";
import AdminDashboard from "./Pages/AdminDashboard";
import MechanicDashboard from "./Pages/MechanicDashboard";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/select-role" element={<RoleSelectPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/mechanic-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['mechanic']}>
                <MechanicDashboard />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

