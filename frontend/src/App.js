import logo from './logo.svg';
import './App.css';

function SignUpButton() {
  return (
    <button className = "SignUpButton"> Sign Up </button>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Flourish
        </p>
        <SignUpButton />
      </header>
    </div>
  );
}

export default App;
