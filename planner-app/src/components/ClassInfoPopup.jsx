/* eslint-disable react/prop-types */


const ClassInfoPopup = ({ event, userEnrolled }) => {
  // extract the properties of the event object that you need
  const { start, end, title } = event;
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const localizedDate = start.toLocaleDateString('nl-NL', options);
  console.log(localizedDate);




  // handle the click on the cancel or enroll button
  const handleCancel = () => {
    console.log('Cancelled enrollment');
  };

  const handleEnroll = () => {
    console.log('Enrolled in class');
  };


  // determine which button to render
  const button = userEnrolled ? <button onClick={handleCancel}>Uitschrijven</button> : <button onClick={handleEnroll}>Inschrijven</button>;

  // render the popup content
  return (
    <div>
      <h3>{title}</h3>
      <p>Datum: {localizedDate}</p>
      <p>Start tijd: {startTime}</p>
      <p>Eind tijd: {endTime}</p>

      <p>Beschikbare plaatsen: 10 (van 10)</p>
      <p>Status: {userEnrolled ? 'Je bent ingeschreven' : 'Niet ingeschreven'}</p>
      {button}
    </div>
  );
};

export default ClassInfoPopup;
