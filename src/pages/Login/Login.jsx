import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Login/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validationErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      validationErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const result = await axios.get(
        "http://localhost:8000/users"
      );

      const user = result.data.find(
        (item) =>
          item.email.toLowerCase() ===
          formData.email.trim().toLowerCase()
      );

      if (!user) {
        setErrors({
          email: "Email is not registered",
        });
        return;
      }

      if (user.password !== formData.password) {
        setErrors({
          password: "Incorrect password",
        });
        return;
      }

      const rawRole = user.role.trim().toLowerCase().replace(/\s+/g, "");
      const role =
        rawRole === "admin"
          ? "admin"
          : rawRole === "employee"
            ? "employee"
            : rawRole === "lead" || rawRole === "teamleader"
              ? "lead"
              : null;

      if (!role) {
        setErrors({ general: "Invalid user role" });
        return;
      }

      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
      };

      login(loggedInUser);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "lead") {
        navigate("/lead");
      } else if (role === "employee") {
        navigate("/employee");
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general:
          "Unable to connect to the server. Please try again.",
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>MMAX</h2>

        <p>Log in to your account</p>

        <form onSubmit={handleSubmit} className="login">
          {errors.general && (
            <p className="text-danger">
              {errors.general}
            </p>
          )}

          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <span className="text-danger">
              {errors.email}
            </span>
          )}

          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <span className="text-danger">
              {errors.password}
            </span>
          )}

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <div className="sign">
          <span>
            No Account? <Link to="/signup">Signup</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;