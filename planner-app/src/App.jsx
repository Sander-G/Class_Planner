import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Admin from './components/Admin';
import NotFound from './components/NotFound';
import { initializeFirebaseApp } from '../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore'



function App() {
  console.log('in app component', initializeFirebaseApp());
  const navigate = useNavigate();


  const fetchUserRole = async () => {
    try {
      const { auth, db } = await initializeFirebaseApp();
      const user = auth.currentUser;

      if (user) {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);

        for (const docSnap of querySnapshot.docs) {
          const userData = docSnap.data();
          if (userData.uid === user.uid) {
            const role = userData.role;
            console.log(role);
            return role;
          }
        }

        console.log('User document not found');
        return null;
      } else {
        console.log('User not authenticated');
        return null;
      }
    } catch (err) {
      console.log('Error fetching user role:', err);
      return null;
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      const { auth } = await initializeFirebaseApp();
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userRole = await fetchUserRole();
          if (userRole) {
            // Role retrieved 
            console.log('User Role:', userRole);

            if (userRole === 'admin') {
              navigate('/admin');
            } else {
              navigate('/home');
            }
          } else {
            // Role not found or error 
            console.log('User Role not found');
            // Handle accordingly
            navigate('/')
          }
        
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
        <Route path='/signup' element={<Signup />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/admin' element={<Admin />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
