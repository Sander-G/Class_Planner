import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminSignup from './AdminSignup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {styled} from 'styled-components'

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all users from Firestore on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(users);
      } catch (err) {
        setError(err.message);
      }
    };

    getUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', id));
     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Render the Signup component to add a new user
 const renderSignup = () => {
    const handleSignupSuccess = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'users'));
        const updatedUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(updatedUsers);
      } catch (err) {
        setError(err.message);
      }
    };

   return (
     <div className='admin__signup'>
       <AdminSignup onSuccess={handleSignupSuccess} />
     </div>
   );
 };

  // Render the list of users
  const renderUsers = () => {
    return (
      <UserLWrapper>
        <h3>Ledenlijst:</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <span>{user.name}  ({user.email}) </span>
               <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(user.id)}>Delete</FontAwesomeIcon>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </UserLWrapper>
    );
  };

  return (
    <>
      {error && <p>{error}</p>}
      {renderSignup()}
      {renderUsers()}
    </>
  );
};


const UserLWrapper = styled.div`
  border: 1px solid white;
  padding: 1rem;
  border-radius: 4px;
text-align: left;
& h3 {
  text-align: center;
}

 
`;
export default UserList;


