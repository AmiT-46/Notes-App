import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import authIllustration from "../../assets/auth-illustration.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();
    if (!name.trim()) return setError("Please enter your name");
    if (!validateEmail(email)) return setError("Please enter a valid email address");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    try {
      setError("");
      const response = await axiosInstance.post("/create-account", { fullName: name.trim(), email, password });
      if (response.data?.error) return setError(response.data.message);
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
          <p className="auth-layout__eyebrow">START ORGANIZING</p>
          <h1>Create your workspace</h1>
          <p className="auth-layout__description">A thoughtful home for every idea, plan, and reminder.</p>
          <form className="auth-form" onSubmit={handleSignUp}>
            <label className="form-label" htmlFor="signup-name">YOUR NAME</label>
            <input id="signup-name" type="text" placeholder="Jane Doe" className="form-input" value={name} onChange={(event) => setName(event.target.value)} />
            <label className="form-label" htmlFor="signup-email">EMAIL ADDRESS</label>
            <input id="signup-email" type="email" placeholder="you@example.com" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} />
            <label className="form-label" htmlFor="signup-password">PASSWORD</label>
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="button button--primary auth-form__submit">Create account</button>
          </form>
          <p className="auth-layout__switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
      <aside className="auth-layout__visual-side">
        <img src={authIllustration} alt="Notes and productivity illustration" />
        <p>One small note can start something meaningful.</p>
      </aside>
    </main>
  );
};

export default SignUp;
