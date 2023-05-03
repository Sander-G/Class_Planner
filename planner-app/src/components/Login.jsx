import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in as', user.uid);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Yoga Class Planner</h1>
      <p>Please sign in to access the planner</p>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type='email' value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Password:
          <input type='password' value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        
        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
};

export default Login;
