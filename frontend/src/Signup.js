
import './App.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Signup() {
  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  
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

  return (
 
    <div className="background">
      <div className="login-container">
        <h1>SIGN UP</h1>

        <form onSubmit={handleSignup}>

          <div className="input-group">
            <span className="icon">👤</span>

            <input
              type="text"
              placeholder="username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              required
            />  
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
            />
          </div>

          <p 
            className="signup-text">
            Already have a Flourish account?{" "}
            <span
                className="link-text"
                onClick={() => navigate('/')}
                >
                     Sign in
                </span>
            </p>

            <button type="submit"> Sign Up</button>
            {signupMessage && <p>{signupMessage}</p>}
        </form>
      </div>
    </div>
       

  );
}

export default Signup;
  