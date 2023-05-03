
import './App.css'
import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Admin from './components/Admin'
import Home from './components/Home'
import NotFound from './components/NotFound'
import { initializeFirebaseApp } from '../firebaseConfig';

function App() {
// fetch('https://ly-firebase-cfg.netlify.app/.netlify/functions/admin', {
//   method: 'POST',
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));



  // useEffect(() => {
  //   const getCustomClaims = async () => {
  //     const uid = 'tpTtSmZKExeCv9rIUoZRaJX6igs2';
  //     const response = await fetch(`https://ly-firebase-cfg.netlify.app/.netlify/functions/checkCustomClaims?uid=${uid}`);
  //     const data = await response.json();
  //     console.log(data);
  //   };

  //   getCustomClaims();
  // }, []);







   console.log('in app component', initializeFirebaseApp()); 
  const navigate = useNavigate();

 useEffect(() => {
   const fetchData = async () => {
     const { auth } = await initializeFirebaseApp();
     console.log('auth:', auth);
     const unsubscribe = auth.onAuthStateChanged((user) => {
       if (user) {
         // User is logged in, redirect to home page
         navigate('/home');
       } else {
         // User is logged out, redirect to login page
         navigate('/');
       }
     });
     return unsubscribe;
   };
   fetchData();
 }, [navigate]);


  return (
    <>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/admin' element={<Admin />} />
        <Route exact path='/home' element={<Home />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App
