import { useEffect, useState } from 'react';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../firebaseConfig';
import PropTypes from 'prop-types';

const EnrolledUsers = ({ selectedEvent }) => {
  const [enrolledUsersData, setEnrolledUsersData] = useState([]);

  useEffect(() => {
    const fetchEnrolledUsersData = async () => {
      if (!selectedEvent) {
        return;
      }

      const { db } = await initializeFirebaseApp();

      const enrolledUsersData = await Promise.all(
        selectedEvent.enrolled_users.map(async (uid) => {
          const usersRef = collection(db, 'users');
          const usersQuery = query(usersRef, where('uid', '==', uid));
          const userDocSnapshot = await getDocs(usersQuery);

          if (!userDocSnapshot.empty) {
            const userData = userDocSnapshot.docs[0].data();

            if (userData && userData.name) {
              return { uid, name: userData.name };
            }
          }

          return null;
        })
      );

      const filteredData = enrolledUsersData.filter((data) => data !== null);
      setEnrolledUsersData(filteredData);
    };

    fetchEnrolledUsersData();
  }, [selectedEvent]);

  if (!selectedEvent) {
    return null;
  }

  return (
    <div>
      <h3>Enrolled Users:</h3>
      {enrolledUsersData.map(({ uid, name }) => (
        <p key={uid}>{name}</p>
      ))}
    </div>
  );
};

EnrolledUsers.propTypes = {
  selectedEvent: PropTypes.object,
};

export default EnrolledUsers;
