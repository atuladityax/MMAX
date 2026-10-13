import "../Signup/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    if (!formData.name.trim()) {
      isValid = false;
      validationErrors.name = "Name Required";
    }
    if (formData.email === " " || formData.email === null) {
      isValid = false;
      validationErrors.name = "Email Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      isValid = false;
      validationErrors.email = "email is not valid";
    }
    if (!formData.role) {
      isValid = false;
      validationErrors.role = "Role Is Required ";
    }
    if (formData.password === " " || formData.password === null) {
      isValid = false;
      validationErrors.password = "Email Required";
    } else if (formData.password.length < 6) {
      isValid = false;
      validationErrors.password = "password is not valid ";
    }
    setErrors(validationErrors);
    setValid(isValid);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:8000/users", formData)
        .then(() => {
          alert("Registration successful!");
          navigate("/login");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <div className="contaniner">
        <div className="header">
          <h2>MMAX</h2>
          <p>Create Your Account</p>
          <form className="sign-up" action="" onSubmit={handleSubmit}>
            {valid ? (
              <></>
            ) : (
              <span className="text-danger">
                {errors.name} ;{errors.email} ;{errors.role} ;{errors.password}{" "}
                ;
              </span>
            )}
            <label htmlFor="">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
            <label htmlFor="">email</label>
            <input
              type="email"
              name="email"
              placeholder="Email Id "
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
            <label htmlFor="">Role</label>
            <select
              className="dropdown"
              name="Role"
              id="Role"
              onChange={(event) =>
                setFormData({ ...formData, role: event.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Team Leader">Team Leader</option>
              <option value="employee">Employee</option>
            </select>
            <button className="btn">Sign up</button>
            <span>
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
