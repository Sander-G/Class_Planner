import { useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../firebaseConfig';

const AddExistingUsers = () => {
    useEffect(() => {
        const addExistingUsersToCollection = async () => {
            try {
                const { db } = await initializeFirebaseApp();

                // Fetch existing users from Firebase Auth
                const users = await getUsersFromFirebaseAuth();

                // Add existing users to the "users" collection
                for (const user of users) {
                    await addDoc(collection(db, 'users'), {
                        uid: user.uid,
                        name: user.displayName || '',
                        email: user.email || '',
                        selectedClass: '', 
                    });
                }

                console.log('Existing users added to the collection');
            } catch (err) {
                console.error('Error adding existing users:', err);
            }
        };

        addExistingUsersToCollection();
    }, []);

    const getUsersFromFirebaseAuth = async () => {
        const { db } = await initializeFirebaseApp();
        const users = [];

        // Fetch all users from Firebase Auth
        const querySnapshot = await getDocs(collection(db, 'users'));

        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        return users;
    };

    return null;
};

export default AddExistingUsers;
