import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../firebaseConfig';


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleAgreeChange = (e) => setAgree(e.target.checked);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate input
    if (!name || !email || !password || !selectedClass || !agree) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Create user in Firebase Auth
      const auth = getAuth();
      const { db } = await initializeFirebaseApp();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed up as', user.uid);

      // Save user data to Firestore
      const userDocRef = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        email,
        selectedClass,
      });

      console.log('Document written with ID:', userDocRef.id);

      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='signupScreen'>
     
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
        <div className='input'>
          <label>
            Name:
            <input type='text' name='name' value={name} onChange={handleNameChange} />
          </label>
        </div>
        <div className='input'>
          <label>
            Email:
            <input type='email' name='email' value={email} onChange={handleEmailChange} />
          </label>
        </div>
        <div className='input'>
          <label>
            Password:
            <input type='password' name='password' value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <div className='input'>
          <label>
            Class:
            <select name='class' value={selectedClass} onChange={handleClassChange}>
              <option value=''>Select a class</option>
              <option value='Hatha Yoga'>Hatha Yoga</option>
              <option value='Vinyasa Yoga'>Vinyasa Yoga</option>
            </select>
          </label>
        </div>
        <div className='input'>
          <label>
            <input type='checkbox' name='agree' checked={agree} onChange={handleAgreeChange} />I agree with the Lotta Yoga general terms & conditions
          </label>
        </div>
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
