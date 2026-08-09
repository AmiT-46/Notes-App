import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import authIllustration from "../../assets/auth-illustration.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    if (!validateEmail(email)) return setError("Please enter a valid email address");
    if (!password) return setError("Please enter your password");

    try {
      setError("");
      const response = await axiosInstance.post("/login", { email, password });
      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-layout__form-side">
        <Link to="/" className="auth-layout__brand">NOTES</Link>
        <div className="auth-layout__form-wrap">
          <p className="auth-layout__eyebrow">WELCOME BACK</p>
          <h1>Sign in to your workspace</h1>
          <p className="auth-layout__description">Pick up where your thoughts left off.</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <label className="form-label" htmlFor="login-email">EMAIL ADDRESS</label>
            <input id="login-email" type="email" placeholder="you@example.com" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} />
            <label className="form-label" htmlFor="login-password">PASSWORD</label>
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="button button--primary auth-form__submit">Sign in</button>
          </form>
          <p className="auth-layout__switch">New to Notes? <Link to="/signUp">Create an account</Link></p>
        </div>
      </section>
      <aside className="auth-layout__visual-side">
        <img src={authIllustration} alt="Notes and productivity illustration" />
        <p>Your ideas deserve a calm place to grow.</p>
      </aside>
    </main>
  );
}

export default Login;
