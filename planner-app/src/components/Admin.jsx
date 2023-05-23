import { useState, useEffect } from 'react';
import { initializeFirebaseApp } from '../../firebaseConfig';
import { collection, getDocs, addDoc, writeBatch, query, where } from 'firebase/firestore';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/nl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { styled } from 'styled-components';
import UserList from './UserList';
import EnrolledUsers from './EnrolledUsers';
import {useNavigate}  from 'react-router-dom';
import './Admin.css'

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

  const generateClassId = (title) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const classId = `${title}_${randomNumber}`;
    return classId;
  };

  useEffect(() => {
    const fetchClasses = async () => {
      const { db } = await initializeFirebaseApp();
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          class_id: data.class_id,
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
      console.log(db);
      setEvents(classesData);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    // Add a click event listener to the delete button
    if (selectedEvent) {
      const deleteButton = document.getElementById('delete-button');
      deleteButton.addEventListener('click', () => {
        handleDeleteEvent(selectedEvent);
      });

      return () => {
        // Remove the event listener when the component unmounts
        deleteButton.removeEventListener('click', handleDeleteEvent);
      };
    }
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);

    console.log('Selected event:', event);
    const id = event.class_id;
    console.log('dit is het event class ID:', id);

    // Add a click event listener to the delete button
    //  const deleteButton = document.getElementById('delete-button');
    //  deleteButton.addEventListener('click', () => {
    //    handleDeleteEvent(id);
    //  });
  };

  const handleAddClass = async () => {
    event.preventDefault();
    console.log('form submitted!');
    const { db } = await initializeFirebaseApp();
    const classId = generateClassId(title);

    if (recurring) {
      // If recurring is checked, add classes for the rest of the year
      const date = new Date(startTime);
      const endOfYear = new Date(date.getFullYear() + 1, 0, 1);
      while (date < endOfYear) {
        const newClassRef = await addDoc(collection(db, 'classes'), {
          class_id: classId,
          title: title,
          start_time: date,
          end_time: new Date(date.getTime() + (endTime - startTime)),
          teacher: teacherName,
          recurring,
          max_spots: 10,
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
        class_id: classId,
        title: title,
        start_time: startTime,
        end_time: endTime,
        teacher: teacherName,
        recurring,
        max_spots: 10,
        available_spots: 10,
        enrolled_users: [],
      });
      console.log('New class addid with ID:', newClassRef.id);
    }

    console.log('title:', title);
    console.log('start_time:', startTime);
    console.log('end_time:', endTime);
    console.log('teacherName:', teacherName);
    console.log('recurring:', recurring);

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
        class_id: data.class_id,
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


 const handleDeleteEvent = async (class_id) => {
   console.log(class_id);
   try {
     const { db } = await initializeFirebaseApp();
     console.log(selectedEvent);
     console.log(selectedEvent.class_id);
     const querySnapshot = await getDocs(
      query(collection(db, 'classes'), where('class_id', '==', selectedEvent.class_id)));
    console.log(querySnapshot)
     const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
        console.log('Class deleted with ID:', doc.id);
      });

      await batch.commit();
      setSelectedEvent(null);
      const newQuerySnapshot = await getDocs(collection(db, 'classes'));

      const classesData = newQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          class_id: data.class_id,
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
    } catch (error) {
      console.error(error);
    }
  };


const navigate = useNavigate();

 const handleLogout = async () => {
   try {
     const { auth } = await initializeFirebaseApp();
     await auth.signOut();
     navigate('/');
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
      <img src='/public/logo.png' className='logo' alt='Lotta Yoga logo' />
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
          <AddClassWrapper>
            <h3>{selectedEvent.title}</h3>
            <p>Class ID: {selectedEvent.class_id}</p>
            <p>Docent: {selectedEvent.teacher}</p>
            <p>
              Beschikbare plaatsen: {selectedEvent.available_spots} van: {selectedEvent.max_spots}
            </p>
            {/* {selectedEvent.enrolled_users.map((uid) => (
              <p key={uid}>{selectedEvent.name}</p>
            ))} */}

            <EnrolledUsers selectedEvent={selectedEvent} />
            <p>{selectedEvent.start.toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })}</p>
            <p>{selectedEvent.end.toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })}</p>

            {selectedEvent.recurring && (
              <div>
                <input type='checkbox' id='deleteRecurring' />
                <label htmlFor='deleteRecurring'>Delete all recurring events</label>
              </div>
            )}
            <button id='delete-button'>Verwijder!</button>
          </AddClassWrapper>
        ) : null}
        <AddClassWrapper>
          <Form onSubmit={handleAddClass}>
            <h3>Les Toevoegen:</h3>
            <label htmlFor='title'>Naam van de Yogales:</label>
            <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor='teacher-name'>Docent:</label>
            <input type='text' id='teacher-name' value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />

            <label htmlFor='start-time'>Start Tijd:</label>
            <DatePicker id='start-time' selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect timeFormat='HH:mm' timeIntervals={15} dateFormat='dd/MM/yyyy HH:mm' />

            <label htmlFor='end-time'>Eind Tijd:</label>
            <DatePicker id='end-time' selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect timeFormat='HH:mm' timeIntervals={15} dateFormat='dd/MM/yyyy HH:mm' />

            <label htmlFor='recurring'>
              Herhalende Les?
              <input type='checkbox' id='recurring' aria-label='elke week voor de rest van het jaar!' checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            </label>
            <button type='submit'>Voeg toe!</button>
          </Form>
        </AddClassWrapper>
        <UserListWrapper>
          <UserList />
        </UserListWrapper>
        <div className='logoutButton'>
          <button onClick={handleLogout}>Uitloggen</button>
        </div>
      </Wrapper>
    </div>
  );
}


const Wrapper = styled.div`
  display: flex;
  flex-basis: 50vw;
  gap: 2rem;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 4px;
`;

const AddClassWrapper = styled.div`
display: flex;
flex-direction: column;
border: 1px solid white;
border-radius: 4px;
min-width: 170px;
padding: 2rem;


`;
const UserListWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
border: 1px solid white;
border-radius: 4px;
min-width: 170px;
padding: 2rem;


`;
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
    background-color: transparent;
    width: 100%;
    position: relative;
  }

  input[type='checkbox']::after {
    content: 'Herhaal deze les elke week, voor de rest van het jaar!';
    display: inline-block;
    position: relative;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    left: 5rem;
    top: -2rem;
    transition: opacity 0.3s ease-in-out;
  }

  input[type='checkbox']:hover::after {
    opacity: 1;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #006b8e;
    }
  }
`;
