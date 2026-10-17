import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Signup/Signup.css";

const API = "http://localhost:8000";
const initialForm = { name: "", email: "", password: "", role: "" };

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "", general: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const validationErrors = {};

    if (!name) validationErrors.name = "Name is required.";
    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Enter a valid email address.";
    }
    if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.role) validationErrors.role = "Choose a role.";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const existingUsers = await axios.get(`${API}/users`);
      const emailExists = existingUsers.data.some(
        (user) => user.email?.trim().toLowerCase() === email,
      );
      if (emailExists) {
        setErrors({ email: "An account with this email already exists." });
        return;
      }

      await axios.post(`${API}/users`, {
        name,
        email,
        password: formData.password,
        role: formData.role,
      });
      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. You can now log in." },
      });
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        general:
          "Could not register your account. Make sure the JSON Server is running, then try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contaniner">
      <div className="header">
        <h2>MMAX</h2>
        <p>Create Your Account</p>
        <form className="sign-up" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <p className="text-danger" role="alert">{errors.general}</p>
          )}

          <label htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "signup-name-error" : undefined}
          />
          {errors.name && <span className="text-danger" id="signup-name-error">{errors.name}</span>}

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
          />
          {errors.email && <span className="text-danger" id="signup-email-error">{errors.email}</span>}

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "signup-password-error" : undefined}
          />
          {errors.password && <span className="text-danger" id="signup-password-error">{errors.password}</span>}

          <label htmlFor="signup-role">Role</label>
          <select
            className="dropdown"
            name="role"
            id="signup-role"
            value={formData.role}
            onChange={handleChange}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? "signup-role-error" : undefined}
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Team Leader">Team Leader</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && <span className="text-danger" id="signup-role-error">{errors.role}</span>}

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
          <span>
            Already have an account? <Link to="/login">Log in</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
