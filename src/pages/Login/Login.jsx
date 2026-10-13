
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../Login/Login.css"
const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
      });

    const [errors, setErrors] = useState({});
    const [valid, setValid] = useState(true);

  
const handleSubmit = (e) => {
  e.preventDefault();

  let isValid = true;
  let validationErrors = {};

  if (!formData.email.trim()) {
    isValid = false;
    validationErrors.email = "Email Required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    isValid = false;
    validationErrors.email = "Email is not valid";
  }

  if (!formData.password.trim()) {
    isValid = false;
    validationErrors.password = "Password Required";
  }

  setErrors(validationErrors);
  setValid(isValid);

  // Stop if validation fails
  if (!isValid) return;

  axios
    .get("http://localhost:8000/users")
    .then((result) => {
      const user = result.data.find(
        (user) => user.email === formData.email
      );

      if (!user) {
        setErrors({ email: "Email is not registered" });
        setValid(false);
      } else if (user.password !== formData.password) {
        setErrors({ password: "Wrong password" });
        setValid(false);
      } else {
        alert("Login successful!");
    
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Unable to connect to the server.");
    });
};

  return (
    <>
    <div className="container">
        <div className="header">
            <h2>MMAX</h2> 
            <p>Log in to your account</p>
            <form onSubmit={handleSubmit} action="" className="login">
                    {!valid && (
                    <span className="text-danger">
                     {errors.email || errors.password}
                     </span>
)}
                <label htmlFor="">Email</label>
                <input type="email" 
                name="email"
                onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
                />
                <label htmlFor="">Password</label>
                <input type="password"
                name="password"
                onChange={(event) => setFormData({ ...formData , password: event.target.value })} 
                />
                <button className="btn">Login</button>
            </form>
            <div className="sign">
                <span>No Account? <Link to="/signup">Signup </Link> </span>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login