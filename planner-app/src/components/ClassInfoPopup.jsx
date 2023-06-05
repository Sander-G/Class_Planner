/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ClassInfoPopup = ({ event }) => {
  const [availableSpots, setAvailableSpots] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [maxSpots, setMaxSpots] = useState();

  const { start, end, title, id } = event;
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const localizedDate = start.toLocaleDateString('nl-NL', options);

  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      const { db, auth } = await initializeFirebaseApp();
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        const classRef = doc(db, 'classes', id);
        const classSnapshot = await getDoc(classRef);
        const classData = classSnapshot.data();
        if (classData && classData.enrolled_users.includes(userUid)) {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
        }
        if (classData) {
          setEnrolledUsers(classData.enrolled_users);
          setMaxSpots(classData.max_spots);
        }
      }
    };

    fetchEnrollmentStatus();
  }, [id, setIsEnrolled]);

  useEffect(() => {
    const updatedAvailableSpots = maxSpots - enrolledUsers.length;
    setAvailableSpots(updatedAvailableSpots);
  }, [enrolledUsers, maxSpots]);

  const handleEnroll = async () => {
    const { db, auth } = await initializeFirebaseApp();
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
      const classRef = doc(db, 'classes', id);
      const classSnapshot = await getDoc(classRef);
      const classData = classSnapshot.data();
      if (classData) {
        if (classData.enrolled_users.includes(userUid)) {
          console.log('Already enrolled');
        } else if (classData.available_spots > 0) {
          const updatedEnrolledUsers = [...classData.enrolled_users, userUid];
          const updatedAvailableSpots = classData.available_spots - 1;
          await updateDoc(classRef, { enrolled_users: updatedEnrolledUsers, available_spots: updatedAvailableSpots });
          setIsEnrolled(true);
          setEnrolledUsers(updatedEnrolledUsers);
          console.log('Enrolled in class');
        } else {
          console.log('No available spots');
        }
      }
    }
  };

  const handleCancel = async () => {
    const { db, auth } = await initializeFirebaseApp();
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
      const classRef = doc(db, 'classes', id);
      const classSnapshot = await getDoc(classRef);
      const classData = classSnapshot.data();
      if (classData && classData.enrolled_users.includes(userUid)) {
        const updatedEnrolledUsers = classData.enrolled_users.filter((uid) => uid !== userUid);
        const updatedAvailableSpots = classData.available_spots + 1;
        await updateDoc(classRef, { enrolled_users: updatedEnrolledUsers, available_spots: updatedAvailableSpots });
        setIsEnrolled(false);
        setEnrolledUsers(updatedEnrolledUsers);
        console.log('Cancelled enrollment');
      } else {
        console.log('Not enrolled in class');
      }
    }
  };

  const button = isEnrolled === null ? <p>Laden...</p> : isEnrolled ? <button onClick={handleCancel}>Uitschrijven</button> : <button onClick={handleEnroll}>Inschrijven</button>;

  return (
    <div className='classInfo'>
      <div>
        <h3>{title}</h3>
        <p>Datum: {localizedDate}</p>
        <p>Tijd: {startTime} - {endTime}</p>
        <p>
          Beschikbare plaatsen: {availableSpots} (van {maxSpots})
        </p>
        <p>Status: {isEnrolled ? 'Je bent ingeschreven' : 'Niet ingeschreven'}</p>
      </div>
      <div className='buttonWrapper'>{button}</div>
    </div>
  );
};

export default ClassInfoPopup;
