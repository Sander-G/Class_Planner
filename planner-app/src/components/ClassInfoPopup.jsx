/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { initializeFirebaseApp } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const ClassInfoPopup = ({ event }) => {
  const [availableSpots, setAvailableSpots] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [maxSpots, setMaxSpots] = useState();

  // extract properties of the event object 
  const { start, end, title, id } = event;
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const localizedDate = start.toLocaleDateString('nl-NL', options);


  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      const { db } = await initializeFirebaseApp();
      const { auth } = await initializeFirebaseApp();
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
          setEnrolledUsers(classData.enrolled_users)
          setAvailableSpots(classData.available_spots);
          setMaxSpots(classData.max_spots);
        }
      }
    };

    fetchEnrollmentStatus();
  }, [id, setIsEnrolled, setAvailableSpots, setEnrolledUsers]);


  console.log('wat is status?', isEnrolled)
  console.log('hoeveel nog', availableSpots)
  console.log('enrolled users:', enrolledUsers)
  console.log('max spots', maxSpots)

 


  // handle the click on the cancel or enroll button

  const handleEnroll = async () => {
    const { db } = await initializeFirebaseApp();
    const { auth } = await initializeFirebaseApp();
  
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
         console.log('User UID:', auth.currentUser.uid);
      const classRef = doc(db, 'classes', id);
      const classSnapshot = await getDoc(classRef);
      const classData = classSnapshot.data();
      if (classData) {
        console.log('Class Data:', classData);
        console.log('Enrolled Users:', classData.enrolled_users);
        if (classData.enrolled_users.includes(userUid)) {
          console.log('Already enrolled');
        } else if (classData.available_spots > 0) {
          const updatedEnrolledUsers = [...classData.enrolled_users, userUid];
          const updatedAvailableSpots = classData.available_spots - 1;
          await updateDoc(classRef, { enrolled_users: updatedEnrolledUsers, available_spots: updatedAvailableSpots });
          setIsEnrolled(true);
          setAvailableSpots(updatedAvailableSpots);
          console.log('Enrolled in class');
        } else {
          console.log('No available spots');
        }
      }
    }
  };


  const handleCancel = async () => {
    const { db } = await initializeFirebaseApp();
    const { auth } = await initializeFirebaseApp();
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
        setAvailableSpots(updatedAvailableSpots);
        setEnrolledUsers(updatedEnrolledUsers);
        console.log('Cancelled enrollment');
      } else {
        console.log('Not enrolled in class');
      }
    }
  };


  // determine which button to render
  const button = isEnrolled === null
    ? <p>Laden...</p>
    : isEnrolled
      ? <button onClick={handleCancel}>Uitschrijven</button>
      : <button onClick={handleEnroll}>Inschrijven</button>;

  // render the popup content
  return (
    <div className="classInfo">
    <div>
      <h3>{title}</h3>
      {/* <p>Class ID: {id}</p> */}
      <p>Datum: {localizedDate}</p>
      <p>Start tijd: {startTime}</p>
      <p>Eind tijd: {endTime}</p>

      <p>Beschikbare plaatsen: {availableSpots} (van {maxSpots})</p>


      <p>Status: {isEnrolled ? 'Je bent ingeschreven' : 'Niet ingeschreven'}</p>
      </div>
      <div className="buttonWrapper">
      {button}
      </div>
    </div>
  );
};

export default ClassInfoPopup;
