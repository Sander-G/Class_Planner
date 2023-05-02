
import './App.css'
import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Admin from './components/Admin'
import Home from './components/Home'
import NotFound from './components/NotFound'
import { auth } from '../firebaseConfig';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
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
