import { useEffect, useState } from 'react';
import { query, where, getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../firebaseConfig';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EnrolledUsers = ({ selectedEvent }) => {
  const [enrolledUsersData, setEnrolledUsersData] = useState([]);

  const removeUser = async (uid) => {
    const { db } = await initializeFirebaseApp();

    // Remove the user's UID from the enrolled_users array in Firestore
    const eventRef = doc(db, 'classes', selectedEvent.id);
    await updateDoc(eventRef, {
      enrolled_users: selectedEvent.enrolled_users.filter((userUid) => userUid !== uid),
    });

    // Remove the user from the local state
    const updatedEnrolledUsersData = enrolledUsersData.filter((user) => user.uid !== uid);
    setEnrolledUsersData(updatedEnrolledUsersData);
  };

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
      <p>
        Beschikbaar: {selectedEvent.max_spots - enrolledUsersData.length} van {selectedEvent.max_spots}
      <br/> Deelnemers:
      </p>
      {enrolledUsersData.map(({ uid, name }) => (
        <div key={uid}>
          <p>
            {name}&nbsp;
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => {
                if (window.confirm(`Weet je zeker dat je ${name} wil verwijderen van deze les?`)) {
                  removeUser(uid);
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          </p>
        </div>
      ))}
    </div>
  );
};

EnrolledUsers.propTypes = {
  selectedEvent: PropTypes.object,
};

export default EnrolledUsers;
