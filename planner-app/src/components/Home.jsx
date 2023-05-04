import { useState } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/nl';




const localizer = momentLocalizer(moment);


export default function Home() {
  const [events, setEvents] = useState([
    {
      title: 'Class 1',
      start: new Date(),
      end: new Date(),
    },
    {
      title: 'Class 2',
      start: new Date(),
      end: new Date(),
    },
  ]);

  const handleEventSelect = (event) => {
    console.log('Selected event:', event);
    // handle event click hier
  }


  const handleLogout = async () => {
    try {
      const { auth } = await initializeFirebaseApp();
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Home - Overzicht</h2>
      <Calendar
        localizer={localizer}
        culture='nl'
        min={new Date(0, 0, 0, 8)} // 8:00 AM
        max={new Date(0, 0, 0, 22)} // 10:00 PM
        step={60}
        defaultView='week'
        views={['week', 'day']}
        events={events}
        onSelectEvent={handleEventSelect}
        
        
      /><br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
