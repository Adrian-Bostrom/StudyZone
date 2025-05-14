//Libraries for Fullcalendar to work
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import iCalendarPlugin from '@fullcalendar/icalendar';

//Imports local json files
//import assignments from "../data/assignments.json";

//Libraries for fetching iCal link and fixing it
import ICAL from "ical.js";

//Our tools and functions for the code to work
import parseDateToISO from "./components/parseDate.jsx";
import UseFetchJson from "./components/UseFetchJson.jsx";
import { useMemo } from "react";

/*
const fetchAndParseICalData = async (url) => {
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal data: ${response.statusText}`);
    }
    const iCalData = await response.text();

    // Parse the iCal data using ical.js
    const jcalData = ICAL.parse(iCalData);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent").map((vevent) => {
      const event = new ICAL.Event(vevent);
      return {
        title: event.summary || "No Title",
        start: event.startDate.toString(),
        end: event.endDate ? event.endDate.toString() : null,
        description: event.description || "",
        location: event.location || "",
      };
    });
    
    return events;
  } catch (error) {
    console.error("Error fetching or parsing iCal data:", error);
    return [];
  }
};
*/
/*
//Takes the information from the assignments JSON and put them in usable arrays
const assignmentEvents = Object.values(assignments).map((item, index) => ({
  id: index,
  title: item.title,
  start: item.dueDate ? parseDateToISO(item.dueDate) : null,
  url: item.link
}));
*/

function Calendar() {
  /*
  const [iCalLink, setICalLink] = React.useState('');
  const [iCalData, setICalData] = React.useState([]);

  React.useEffect(() => {
    const fetchAndConvertIcal = async () => {
      const events = await fetchAndParseICalData(url); // <-- correct variable
      setICalData(events); // <--- save to state
    };
    fetchAndConvertIcal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (iCalLink) {
      const events = await fetchAndParseICalData(iCalLink); // Fetch and parse the iCal data
      setICalData(events); // Save the parsed events to state
    }
  };
  */

  const userID = localStorage.getItem('userID');

  const bodyData = useMemo(() => ({ userID }), [userID]);

  const { data: assignments, error } = UseFetchJson('http://localhost:5000/assignment', bodyData);
  console.log(assignments);

  console.log("potatis");

    
  const assignmentEvents = assignments
  ? assignments.map((item, index) => ({
      id: index,
      title: item.title,
      date: item.dueDate ? parseDateToISO(item.dueDate) : null,
      url: item.link,
    }))
  : []; // Fallback to an empty array if assignments are null
  
  console.log(assignmentEvents);

/*
Läggs direkt efter div i return
<form onSubmit={handleSubmit}>
<label>
  Insert timeEdit Link:{" "}
  <input
    name="iCalLink"
    value={iCalLink}
    onChange={(e) => setICalLink(e.target.value)} 
  />
</label>
<button
  type="submit"
  style={{
    padding: "8px 16px",
    border: "1px solid #ccc",
    background: "#eee",
    cursor: "pointer",
  }}
>
Enter Link
</button>
</form>
*/
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}

        initialView={"dayGridMonth"}

        headerToolbar={{
          start: "title",
          center: "",
          end: "dayGridMonth timeGridWeek timeGridDay prev next"
        }}

        eventSources={[
          // iCal URL source
          /*
          {
            url: 'https://cloud.timeedit.net/kth/web/stud02/ri.ics?sid=7&p=4&objects=386269.16&l=sv&e=2408&ku=20643&k=2EECEF00B3BF2D11545D7F3CF1A002D8DB',
            format: 'ics'
          },
          */
          // Assignments from JSON
          
          
          {
            events: assignmentEvents
          },
          
          // Assignments from JSON
          /*
          {
            events: iCalData
          }
          */
        ]}

        editable={true}
      />
    </div>
  );
}


/*
events={[
  { title: 'event 1',
    date: '2025-04-16T14:00:00', 
    end: '2025-04-16T14:30:00',
    color: 'red',
    textColor: 'white', 
  }
]} 
*/

export default Calendar;