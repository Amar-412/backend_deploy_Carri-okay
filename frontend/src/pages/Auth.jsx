import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, ROLES } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "./Auth.css";

const API_BASE = "http://localhost:8080/api/auth";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: ROLES.USER
};

function Auth() {

  const [mode, setMode] = useState("sign-in");
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const toggle = () => {
    setMode(prev => (prev === "sign-in" ? "sign-up" : "sign-in"));
    setError("");
    setOtpMode(false);
    setOtp("");
  };

  useEffect(() => {
  if (!otpMode || timer <= 0) return;

  const interval = setInterval(() => {
    setTimer(prev => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [otpMode, timer]);

  useEffect(() => {
  if (!otpMode) return;

  if (timer === 0) {
    setCanResend(true);
  } else {
    setCanResend(false);
  }
}, [timer, otpMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // LOGIN

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");

    try {

      const data = await login(formData.email, formData.password);
      const resolvedRole = data?.role ?? data?.user?.role;

      const redirect =
        from || (resolvedRole === ROLES.ADMIN ? "/admin" : "/dashboard");

      navigate(redirect, { replace: true });

    } catch (err) {
      setError(err.message);
    }
  };

  // REGISTER

  const handleRegister = async (e) => {

    e.preventDefault();
    setError("");

    try {

      setLoading(true);

      if (!otpMode) {
        const response = await fetchWithAuth(`${API_BASE}/send-otp`, {
          method: "POST",
          body: JSON.stringify({
            email: formData.email
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send OTP");
        }

        setOtpMode(true);
        setTimer(120);
        setCanResend(false);
        setOtp("");
      } else {
        const response = await fetchWithAuth(`${API_BASE}/verify-otp`, {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            otp
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setMode("sign-in");
        setOtpMode(false);
        setOtp("");
        setTimer(0);
        setCanResend(false);

        setFormData({
          ...initialFormData,
          email: formData.email
        });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
  setError("");
  setCanResend(false);
  setLoading(true);

  try {
    const response = await fetchWithAuth(`${API_BASE}/send-otp`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend OTP");
    }

    setTimer(120);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const minutes = Math.floor(timer / 60);
const seconds = timer % 60;
const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (

    <div className={`auth-container ${mode} ${theme}`}>

      <div className="auth-row">

        {/* SIGN UP */}

        <div className="auth-col auth-align-center auth-flex-col sign-up">

          <div className="auth-form-wrapper auth-align-center">

            <form className="auth-form sign-up" onSubmit={handleRegister}>

              <div className="auth-input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {otpMode && (
                <div className="auth-input-group">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="auth-input-group">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value={ROLES.USER}>User</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                </select>
              </div>

              {error && <p className="auth-error-msg">{error}</p>}

              {otpMode === false ? (
                <div className="auth-input-group">
                  <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div
                  className="auth-input-group"
                  style={{ display: "flex", gap: "10px"}}
                >
                  <div style={{ width: "70%" }}>
                  <button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Submit"}
                  </button>
                  </div>

                  <div style={{ width: "30%" }}>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                  >
                    Resend OTP
                  </button>
                  </div>

                </div>
              )}

              {otpMode && (
                <p>
                  {timer > 0
                    ? `Resend OTP in ${formattedTime}`
                    : "Didn't receive OTP?"}
                </p>
              )}

              <p>
                Already have an account?{" "}
                <span onClick={toggle} className="auth-pointer">
                  Sign in here
                </span>
              </p>

            </form>

          </div>

        </div>


        {/* SIGN IN */}

        <div className="auth-col auth-align-center auth-flex-col sign-in">

          <div className="auth-form-wrapper auth-align-center">

            <form className="auth-form sign-in" onSubmit={handleLogin}>

              <div className="auth-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="auth-error-msg">{error}</p>}

              <button type="submit">Sign in</button>

              <p>
                Don't have an account?{" "}
                <span onClick={toggle} className="auth-pointer">
                  Sign up here
                </span>
              </p>

            </form>

          </div>

        </div>

      </div>

      <div className="auth-content-row">

        <div className="auth-col auth-align-center auth-flex-col">
          <div className="auth-text sign-in">
            <h2>Welcome</h2>
          </div>
        </div>

        <div className="auth-col auth-align-center auth-flex-col">
          <div className="auth-text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>

      </div>

      <div className="auth-back-home">
        <Link to="/">← Back to Home</Link>
      </div>

    </div>
  );
}

export default Auth;