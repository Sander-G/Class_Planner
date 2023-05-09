import './Login.css'
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { auth } = await initializeFirebaseApp();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in as', user.uid);
       navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='loginScreen'>
      <img src='/public/logo.png' alt='Lotta Yoga logo' />
      <h1>Yoga Class Planner</h1>
      <p>Please sign in to access the planner</p>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className='input'>
          <label>
            Email:
            <input type='email' name='username' autoComplete='username' value={email} onChange={handleEmailChange} />
          </label>
        </div>
        <br />
        <div className='input'>
          <label>
            Password:
            <input type='password' name='current-password' autoComplete='current-password' value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <br />

        <button type='submit'>Sign In</button>
      </form>
      <p>
        Don&apos;t have an account? <Link to='/signup'>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
