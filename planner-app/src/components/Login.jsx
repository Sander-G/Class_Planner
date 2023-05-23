import './Login.css';
import { useState } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';


const SuccessMessage = styled.p`
  color: white;

  padding: 10px;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

// Spinner
const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: ${spinAnimation} 2s linear infinite;
  margin-right: 5px;
`;

function Login( {role} ) {

  Login.propTypes = {
    role: PropTypes.string,
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
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
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { auth } = await initializeFirebaseApp();
      setLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setLoading(false);
      setShowConfirmation(true);
      setResetEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='loginScreen'>
      <img src='/logo.png' className='logo' alt='Lotta Yoga logo' />
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
            <div>
              <button type='submit' className='resetButton'>
                {loading ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  'Verstuur!'
                )}
              </button>
            </div>
          </form>

          <SuccessMessage show={showConfirmation}>Wachtwoord reset mail verzonden!</SuccessMessage>
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
            Nog geen account? <Link to='signup'>Meld je aan!</Link>
          </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
