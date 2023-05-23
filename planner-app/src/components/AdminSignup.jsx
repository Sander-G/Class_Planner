import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../firebaseConfig';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('')
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleIsAdminChange = (e) => setIsAdmin(e.target.checked);
  const handleSubscriptionChange = (e) => setSelectedSubscription(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate input
    if (!name || !email || !password ) {
      setError('Alle velden invullen, alsjeblieft!');
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
        selectedSubscription,
        role: isAdmin ? 'admin' : 'user', // Set the role based on the checkbox value
      });

      console.log('Document written with ID:', userDocRef.id);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className='signupScreen'>
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
            Abonnement:
            <select name='class' value={selectedSubscription} onChange={handleSubscriptionChange}>
              <option value=''>Selecteer je Abonnement</option>
              <option value='1xPerWeek'>1x Per Week</option>
              <option value='2xPerWeek'>2x Per Week</option>
              <option value='ZwangerschapsYoga'>ZwangerschapsYoga</option>
            </select>
          </label>
        </div>
        <div className='input'>
          <label>
            Class:
            <select name='class' value={selectedClass} onChange={handleClassChange}>
              <option value=''>Select a class</option>
              <option value='Hatha Yoga'>Hatha Yoga</option>
              <option value='Vinyasa Yoga'>Vinyasa Yoga</option>
              <option value='Yin Yoga'>Yin Yoga</option>
            </select>
          </label>
        </div>
        <div className='input'>
          <label>
            <input type='checkbox' name='isAdmin' checked={isAdmin} onChange={handleIsAdminChange} />
            Is Admin
          </label>
        </div>

        <button type='submit'>Inschrijven</button>
      </form>
    </div>
  );
};

export default AdminSignup;
