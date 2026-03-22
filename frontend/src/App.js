import logo from './logo.svg';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import './App.css';
import { useState } from 'react';

function App() {
  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate();

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      const text = await res.text();
      setSignupMessage(text);
    } catch (err) {
      setSignupMessage('Error connecting to server');
      console.error(err);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const text = await res.text();
      setLoginMessage(text);

      navigate('/home');
    } catch (err) {
      setLoginMessage('Error connecting to server');
      console.error(err);
    }
  };

  return (
    <Routes>
      <Route 
        path="/"
        element={
              <div className="background">
      <div className="login-container">
        <h1>LOGIN </h1>

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

          <p className="signup-text">New to Flourish? Sign up</p>
          <button type="submit">Login</button>
          {loginMessage && <p>{loginMessage}</p>}
        </form>
      </div>
    </div>
        }
      />

      <Route path="/home" element={<Home />} />
    </Routes>

  );
}

export default App;