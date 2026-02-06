import { useNavigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

function RoleSelectPage() {
  const navigate = useNavigate();

  const handleRole = (role) => {
    if (!isAuthenticated()) {
      // Not logged in yet — send user to login first
      navigate("/login");
      return;
    }

    // Store chosen role for this session and navigate to the selected dashboard
    localStorage.setItem('selectedRole', role);
    if (role === 'admin') {
      navigate("/admin-dashboard");
    } else {
      navigate("/mechanic-dashboard");
    }
  };

  return (
    <div className="RoleSelectPage">
      <div className="RoleSelectCard">
        <h1 className="RoleTitle">Select Your Role</h1>
        <p className="RoleSub">Choose how you want to continue</p>

        <div className="RoleOptions">
          <button className="RoleButton admin" onClick={() => handleRole("admin")}>
            <img src="/manager.png" alt="Admin Icon" className="RoleIcon" />
            Admin
          </button>

          <button className="RoleButton mechanic" onClick={() => handleRole("mechanic")}>
            <img src="/automobile-with-wrench.png" alt="Mechanic Icon" className="RoleIcon" />
            Mechanic
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectPage;

