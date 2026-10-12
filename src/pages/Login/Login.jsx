import { Link } from "react-router-dom"
import "../Login/Login.css"
const Login = () => {
  return (
    <>
    <div className="container">
        <div className="header">
            <h2>MMAX</h2> 
            <p>Log in to your account</p>
            <form action="" className="login">
                <label htmlFor="">Email</label>
                <input type="text" />
                <label htmlFor="">Password</label>
                <input type="password" />
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