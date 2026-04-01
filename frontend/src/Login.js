import Home from './Home';
import './App.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  
  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate();


  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const contentType = res.headers.get("content-type");

      if (res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("organizations", JSON.stringify(data.organizations));

          setLoginMessage("Login successful!");
          navigate('/home');
        } else {
          const text = await res.text();
          setLoginMessage(text);
          navigate('/home');
        }
        navigate('/home');
      } else {
        const errorText = await res.text();
        setLoginMessage(errorText);
      }

    } catch (error) {
      setLoginMessage('Error connecting to server');
      console.error(error);
    }
  };

  return (
 
    <div className="background">
      <div className="login-container">
        <h1>LOGIN</h1>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <span className="icon">👤</span>

            <input
              type="text"
              placeholder="username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />  
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
            />
          </div>

          <p 
            className="signup-text">
            New to Flourish?{" "}
            <span
                className="link-text"
                onClick={() => navigate("/signup")}
                >
                     Sign up
                </span>
            </p>

            <button type="submit"> Login</button>
          {loginMessage && <p>{loginMessage}</p>}
        </form>
      </div>
    </div>
       

  );
}

export default Login;