
import './Home.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/nl'; 
import Modal from 'react-modal';
import ClassInfoPopup from './ClassInfoPopup';



Modal.setAppElement('#root');

export default function Home() {
 
 moment.locale('nl');
 const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const { db } = await initializeFirebaseApp();
      // console.log(db)
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        const enrolledUsersCount = data.enrolled_users.length;
        const availableSpots = data.max_spots - enrolledUsersCount;
        console.log('Classes:', data.enrolled_users);
       
       
        return {
          id: doc.id,
          title: data.title,
          start: data.start_time.toDate(),
          end: data.end_time.toDate(),
          max_spots: data.max_spots,
          enrolled_users: data.enrolled_users,
          available_spots: availableSpots
        };
      });
      
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
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { auth } = await initializeFirebaseApp();
      await auth.signOut();
      console.log('User logged out successfully');
      navigate('/'); // Redirect to login
    } catch (error) {
      console.error(error);
    }
  };

  const messages = {
    allDay: 'Hele dag',
    previous: '<',
    next: '>',
    today: 'Vandaag',
    month: 'Maand',
    week: 'Week',
    day: 'Dag',
    agenda: 'Agenda',
    date: 'Datum',
    time: 'Tijd',
    event: 'Gebeurtenis',
    noEventsInRange: 'Geen gebeurtenissen in dit bereik.',
    showMore: (total) => `+ ${total} meer`,
  };

  const formats = {
    monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM YYYY', culture),
    dayFormat: (date, culture, localizer) => localizer.format(date, 'D MMMM', culture),
  };
   
  return (
    <div className='home-container'>
      <img src='/logo.png' className='logo' alt='Lotta Yoga logo' />
      <h2>Planner - Overzicht</h2>
      <div className='calendar-container'>
        <Calendar
          localizer={localizer}
          messages={messages}
          formats={formats}
          min={new Date(0, 0, 0, 8)} // 8:00 AM
          max={new Date(0, 0, 0, 22)} // 10:00 PM
          step={45}
          defaultView='week'
          views={['week', 'day']}
          events={events}
          onSelectEvent={handleEventSelect}
        />
      </div>
      <Modal isOpen={selectedEvent !== null} onRequestClose={handleClosePopup} style={modalStyles}>
        {selectedEvent && <ClassInfoPopup event={selectedEvent} />}
      </Modal>
      <br />
      <button className='logoutButton' onClick={handleLogout}>Logout</button>
    </div>
  );
}

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
