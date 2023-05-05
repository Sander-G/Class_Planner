/* eslint-disable react/prop-types */

import { useState } from "react";
import { initializeFirebaseApp } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore'





const ClassInfoPopup = ({ event }) => {

  const [isEnrolled, setIsEnrolled] = useState(false);

  // extract the properties of the event object that you need
  const { start, end, title, max_spots, available_spots, id } = event;
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const localizedDate = start.toLocaleDateString('nl-NL', options);
  
  console.log(localizedDate);
  // console.log(db)

  // handle the click on the cancel or enroll button
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
        await updateDoc(classRef, { enrolled_users: updatedEnrolledUsers, available_spots: classData.available_spots + 1 });
        setIsEnrolled(false);
        console.log('Cancelled enrollment');
      } else {
        console.log('Not enrolled in class');
      }
    }
  };

const handleEnroll = async () => {
  const { db } = await initializeFirebaseApp();
  const { auth } = await initializeFirebaseApp();
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
        await updateDoc(classRef, { enrolled_users: updatedEnrolledUsers, available_spots: classData.available_spots - 1 });
        setIsEnrolled(true);
        console.log('Enrolled in class');
      } else {
        console.log('No available spots');
      }
    }
  }
};




  // determine which button to render
  const button = isEnrolled ? <button onClick={handleCancel}>Uitschrijven</button> : <button onClick={handleEnroll}>Inschrijven</button>;

  // render the popup content
  return (
    <div>
      <h3>{title}</h3>
      <p>Class ID: {id}</p>
      <p>Datum: {localizedDate}</p>
      <p>Start tijd: {startTime}</p>
      <p>Eind tijd: {endTime}</p>

      <p>Beschikbare plaatsen: {available_spots} (van {max_spots})</p>
      <p>Status: {isEnrolled ? 'Je bent ingeschreven' : 'Niet ingeschreven'}</p>
      {button}
    </div>
  );
};

export default ClassInfoPopup;
