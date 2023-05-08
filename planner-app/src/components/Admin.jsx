import { useState, useEffect } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/nl'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { styled } from 'styled-components';

export default function Admin() {
moment.locale('nl');
const localizer = momentLocalizer(moment);
const [events, setEvents] = useState([]);
const [selectedEvent, setSelectedEvent] = useState(null);

const [title, setTitle] = useState('');
const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());
const [teacherName, setTeacherName] = useState('');
const [recurring, setRecurring] = useState(false);


 

 useEffect(() => {
   const fetchClasses = async () => {
     const { db } = await initializeFirebaseApp();
     const querySnapshot = await getDocs(collection(db, 'classes'));
     const classesData = querySnapshot.docs.map((doc) => {
       const data = doc.data();
       return {
         id: doc.id,
         title: data.title,
         teacher: data.teacher,
         start: data.start_time.toDate(),
         end: data.end_time.toDate(),
         max_spots: data.max_spots,
         enrolled_users: data.enrolled_users,
         available_spots: data.available_spots,
       };
     });

     console.log('Classes:', classesData);
     console.log(db)
     setEvents(classesData);
   };
   fetchClasses();
 }, []);

 const handleEventSelect = (event) => {
   setSelectedEvent(event);
    
   console.log('Selected event:', event);

 };


 const handleAddClass = async () => {
  event.preventDefault();
  console.log('form submitted!');
   const { db } = await initializeFirebaseApp();


 if (recurring) {
    // If recurring is checked, add classes for the rest of the year
    const date = new Date(startTime);
    const endOfYear = new Date(date.getFullYear() + 1, 0, 1);
    while (date < endOfYear) {
      const newClassRef = await addDoc(collection(db, 'classes'), {
        title: title,
        start_time: date,
        end_time: new Date(date.getTime() + (endTime - startTime)),
        teacher: teacherName,
        recurring,
        available_spots: 10,
        enrolled_users: [],
      });

      console.log('New class added with ID:', newClassRef.id);

      // Increment the date by one week
      date.setDate(date.getDate() + 7);
    }
  } else {
    // If recurring is not checked, add a single class

   const newClassRef = await addDoc(collection(db, 'classes'), {
     title: title,
     start_time: startTime,
     end_time: endTime,
     teacher: teacherName,
     recurring,
     available_spots: 10,
     enrolled_users: [],
   });

   console.log('title:', title);
   console.log('start_time:', startTime);
   console.log('end_time:', endTime);
   console.log('teacherName:', teacherName);
   console.log('recurring:', recurring);

   console.log('New class addid with ID:', newClassRef.id);
  }
   // Clear the form
   setTitle('');
   setStartTime(new Date());
   setEndTime(new Date());
   setTeacherName('');
   setRecurring(false);

   const querySnapshot = await getDocs(collection(db, 'classes'));
   const classesData = querySnapshot.docs.map((doc) => {
     const data = doc.data();
     return {
       id: doc.id,
       title: data.title,
       teacher: data.teacher,
       start: data.start_time.toDate(),
       end: data.end_time.toDate(),
       max_spots: data.max_spots,
       enrolled_users: data.enrolled_users,
       available_spots: data.available_spots,
     };
   });

   setEvents(classesData);
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
    <div>
      <h2>Admin Page</h2>
      <Wrapper>
        <Calendar
          localizer={localizer}
          messages={messages}
          formats={formats}
          min={new Date(0, 0, 0, 10)} // 8:00 AM
          max={new Date(0, 0, 0, 22)} // 10:00 PM
          step={30}
          defaultView='week'
          views={['week', 'day']}
          events={events}
          onSelectEvent={handleEventSelect}
        />
        {selectedEvent ? (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>{selectedEvent.teacher}</p>
            <p>{selectedEvent.start.toString()}</p>
            <p>{selectedEvent.end.toString()}</p>
          </div>
        ) : null}
        <div>
          <Form onSubmit={handleAddClass}>
            <h3>Add Class</h3>
            <label htmlFor='title'>Class Name</label>
            <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor='teacher-name'>Teacher Name</label>
            <input type='text' id='teacher-name' value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />

            <label htmlFor='start-time'>Start Time</label>
            <DatePicker id='start-time' selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect timeFormat='HH:mm' timeIntervals={15} dateFormat='dd/MM/yyyy HH:mm' />

            <label htmlFor='end-time'>End Time</label>
            <DatePicker id='end-time' selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect timeFormat='HH:mm' timeIntervals={15} dateFormat='dd/MM/yyyy HH:mm' />

            <label htmlFor='recurring'>
              Recurring Class
              <input type='checkbox' id='recurring' checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            </label>
            <button type='submit'>Voeg toe!</button>
          </Form>
        </div>

        <div className='logoutButton'>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </Wrapper>
    </div>
  );
}


const Wrapper = styled.div`
display: flex;
flex-basis: 50vw;
gap: 2rem;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  h3 {
    margin-bottom: 10px;
  }

  label {
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type='text'],
  input[type='checkbox'] {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  input[type='checkbox'] {
    margin-top: 5px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #008CBA;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #006B8E;
    }
  }
`;

