import { useState, useEffect } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/nl';
const localizer = momentLocalizer(moment);

import Modal from 'react-modal';
import ClassInfoPopup from './ClassInfoPopup';
Modal.setAppElement('#root');


export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const { db } = await initializeFirebaseApp();
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.name,
          start: data.start_time.toDate(),
          end: data.end_time.toDate(),
          max_spots: data.max_spots,
          enrolled_users: data.enrolled_users,
          
        };
      });
       
       console.log('Classes:', classesData);
      setEvents(classesData);
    };
    fetchClasses();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    console.log('Selected event:', event);
   
  };
  const handleClosePopup = () => {
    setSelectedEvent(null);
  };


  const handleLogout = async () => {
    try {
      const { auth } = await initializeFirebaseApp();
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#525252',
      padding: '2rem',
      zIndex: '7000',
      position: 'fixed',
      border: 'none',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
      borderRadius: '4px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };


  return (
    <div>
      <img src='/logo.png' className='logo' alt='Lotta Yoga logo' />
      <h2>Planner - Overzicht</h2>
      <Calendar
        localizer={localizer}
        culture='nl'
        min={new Date(0, 0, 0, 8)} // 8:00 AM
        max={new Date(0, 0, 0, 22)} // 10:00 PM
        step={45}
        defaultView='week'
        views={['week', 'day']}
        events={events}
        onSelectEvent={handleEventSelect}
      />
      <Modal isOpen={selectedEvent !== null} onRequestClose={handleClosePopup} style={modalStyles}>
        {selectedEvent && <ClassInfoPopup event={selectedEvent} />}
      </Modal>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
