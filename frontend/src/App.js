import logo from './logo.svg';
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
    } catch (err) {
      setLoginMessage('Error connecting to server');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to Flourish</p>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <h3>Sign Up</h3>
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          {signupMessage && <p>{signupMessage}</p>}
        </form>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {loginMessage && <p>{loginMessage}</p>}
        </form>
      </header>
    </div>
  );
}

export default App;