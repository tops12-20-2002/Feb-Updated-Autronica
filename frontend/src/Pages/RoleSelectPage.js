import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function RoleSelectPage() {
  const navigate = useNavigate();
  const MECHANIC_ROLE_PASSWORD = "autronicas123";
  const [showMechanicPasswordModal, setShowMechanicPasswordModal] = useState(false);
  const [mechanicPassword, setMechanicPassword] = useState("");
  const [mechanicPasswordError, setMechanicPasswordError] = useState("");
  const [showMechanicPassword, setShowMechanicPassword] = useState(false);

  const proceedWithRole = (role) => {
    localStorage.setItem("selectedRole", role);
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/mechanic-dashboard");
    }
  };

  const handleRole = (role) => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (role === "mechanic") {
      setMechanicPassword("");
      setMechanicPasswordError("");
      setShowMechanicPasswordModal(true);
      return;
    }

    proceedWithRole(role);
  };

  const closeMechanicPasswordModal = () => {
    setShowMechanicPasswordModal(false);
    setMechanicPassword("");
    setMechanicPasswordError("");
    setShowMechanicPassword(false);
  };

  const handleMechanicPasswordSubmit = (e) => {
    e.preventDefault();
    if (mechanicPassword === MECHANIC_ROLE_PASSWORD) {
      closeMechanicPasswordModal();
      proceedWithRole("mechanic");
      return;
    }
    setMechanicPasswordError("Incorrect password.");
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
            <img src="/AutronicasIcon.png" alt="Mechanic Icon" className="RoleIcon" />
            Autronicas
          </button>
        </div>
      </div>

      {showMechanicPasswordModal && (
        <div className="RolePasswordOverlay" onClick={closeMechanicPasswordModal}>
          <div className="RolePasswordModal" onClick={(e) => e.stopPropagation()}>
            <h3>Chief Mechanic Access</h3>
            <p>Enter password to continue.</p>
            <form onSubmit={handleMechanicPasswordSubmit}>
              <div className="RolePasswordInputRow">
                <input
                  type={showMechanicPassword ? "text" : "password"}
                  placeholder="Password"
                  value={mechanicPassword}
                  onChange={(e) => {
                    setMechanicPassword(e.target.value);
                    if (mechanicPasswordError) setMechanicPasswordError("");
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="RolePasswordToggle"
                  onClick={() => setShowMechanicPassword((prev) => !prev)}
                >
                  {showMechanicPassword ? "Hide" : "View"}
                </button>
              </div>
              {mechanicPasswordError && (
                <p className="RolePasswordError">{mechanicPasswordError}</p>
              )}
              <div className="RolePasswordActions">
                <button type="button" className="cancel-btn" onClick={closeMechanicPasswordModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleSelectPage;
