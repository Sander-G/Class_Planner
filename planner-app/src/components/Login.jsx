import './Login.css'
import { useState } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
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


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { auth } = await initializeFirebaseApp();
      await sendPasswordResetEmail(auth, resetEmail);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className='loginScreen'>
      <img src='/public/logo.png' className='logo' alt='Lotta Yoga logo' />
      <h1>Planner</h1>
      {showResetForm ? (
        <>
          {error && <p>{error}</p>}
          <form onSubmit={handleForgotPassword}>
            <p>Voer je E-mail adres in om je wachtwoord te resetten.</p>

            <div className='resetInput'>
              <label>Email: </label>

              <input type='email' name='reset-email' className='input' autoComplete='email' value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
            </div>

            <br />
            <button type='submit'>Verstuur!</button>
          </form>
          
          <p>
            <Link onClick={() => setShowResetForm(false)}>Terug naar inloggen</Link>
          </p>
        </>
      ) : (
        <>
          {error && <p>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className='input'>
              <label>E-mail:</label>
              <input type='email' name='username' autoComplete='username' value={email} onChange={handleEmailChange} />
            </div>
            <br />
            <div className='input'>
              <label>Wachtwoord: </label>
              <input type='password' name='current-password' autoComplete='current-password' value={password} onChange={handlePasswordChange} />
            </div>
            <br />

            <button type='submit'>Inloggen</button>
          </form>
          <div className='bottomWrapper'>
            <Link onClick={() => setShowResetForm(true)}>Wachtwoord vergeten..</Link>

            <p>
              Nog geen account? <Link to='/signup'>Meld je aan!</Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
