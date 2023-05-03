import './Login.css'
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebaseApp } from '../../firebaseConfig';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='loginScreen'>
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
      <br/>
        <div className='input'>
          <label>
            Password:
            <input type='password' name='current-password' autoComplete='current-password' value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <br />

        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
};

export default Login;
