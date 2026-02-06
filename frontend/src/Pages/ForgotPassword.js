import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style.css";
import { resetPassword } from "../api/auth";

function ForgotPassword() {
    const navigate = useNavigate();
    const logoSrc = process.env.PUBLIC_URL + "/AutronicasLogo.png";

    const [step, setStep] = useState(1); // 1: Email, 2: Answer & New Password
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (step === 1) {
                // Fetch Security Question
                const result = await resetPassword({ email });
                if (result.success) {
                    setQuestion(result.data.security_question);
                    setStep(2);
                } else {
                    setError(result.error || "Email not found");
                }
            } else {
                // Reset Password
                const result = await resetPassword({
                    email: email,
                    security_answer: answer,
                    new_password: newPassword
                });
                if (result.success) {
                    setSuccess("Password reset successfully! Redirecting to login...");
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setError(result.error || "Failed to reset password");
                }
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="RegisterPage"> {/* Reuse RegisterPage styling for centering */}
            <div className="RegisterCard" style={{ maxWidth: '450px' }}>
                <h2 className="PanelTitle">Reset Password</h2>
                <p className="PanelSub">
                    {step === 1 ? "Enter your email to retrieve your security question." : "Answer your security question to set a new password."}
                </p>

                {success ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'green', background: '#e8f5e9', borderRadius: '4px', marginTop: '10px' }}>
                        <p><strong>Success!</strong></p>
                        <p>{success}</p>
                    </div>
                ) : (
                    <form className="RegisterForm" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '15px' }}>{error}</p>}

                        {step === 1 ? (
                            <label className="Field">
                                <span className="FieldLabel">Email Address</span>
                                <input
                                    className="TextInput"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </label>
                        ) : (
                            <>
                                <div style={{ marginBottom: '15px', background: '#f8f9fa', padding: '12px', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Security Question:</div>
                                    <strong style={{ color: '#333' }}>{question}</strong>
                                </div>

                                <label className="Field">
                                    <span className="FieldLabel">Security Answer</span>
                                    <input
                                        className="TextInput"
                                        type="text"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        required
                                        placeholder="Enter your answer"
                                    />
                                </label>

                                <label className="Field">
                                    <span className="FieldLabel">New Password</span>
                                    <input
                                        className="TextInput"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="New password (min 8 chars)"
                                    />
                                </label>
                            </>
                        )}

                        <button className="Primary" type="submit" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? "Processing..." : (step === 1 ? "Next" : "Reset Password")}
                        </button>
                    </form>
                )}

                <p className="BottomText">
                    Remember your password?{" "}
                    <Link className="HighlightLink" to="/login">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
