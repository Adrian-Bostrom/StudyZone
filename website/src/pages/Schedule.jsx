//Libraries for Fullcalendar to work
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import iCalendarPlugin from '@fullcalendar/icalendar';

//Libraries for fetching iCal link and fixing it
import ICAL from "ical.js";
import parseDateToISO from "./components/parseDate.jsx";
import UseFetchJson from "./components/UseFetchJson.jsx";
import { useMemo } from "react";

//Chatbox functionality
import ChatBox from "./components/ChatBox";

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

function Calendar() {
  const [iCalLink, setICalLink] = React.useState('');
  const [iCalData, setICalData] = React.useState([]);
  const [aiEvents, setAiEvents] = React.useState([]);

  // Load AI events from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("aiEvents");
    if (stored) setAiEvents(JSON.parse(stored));
    // Listen for changes (optional, for live updates)
    const onStorage = () => {
      const updated = localStorage.getItem("aiEvents");
      setAiEvents(updated ? JSON.parse(updated) : []);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  //Loads an already used iCalLink to from storage
  React.useEffect(() => {
    const loadICalLinkFromStorage = async () => {
      const savedICalLink = localStorage.getItem("iCalLink");
      if (savedICalLink) {
        console.log("Loading saved iCalLink:", savedICalLink);
        const events = await fetchAndParseICalData(savedICalLink);
        setICalData(events); // Set the fetched events to the calendar
      }
    };

    loadICalLinkFromStorage(); // Call the function to load the iCalLink on page load
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  //Handles saving link, fetching and parsing iCalLink, and saving it for future uses
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (iCalLink) {
      const events = await fetchAndParseICalData(iCalLink);
      setICalData(events); 
      localStorage.setItem("iCalLink", iCalLink);
    }
  };

  //Fetches userID and uses it to find the users assignments
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);
  const { data: assignments, error } = UseFetchJson('/assignment', bodyData);
    
  //Converts the assignment JSON to a usable format for the calendar
  const assignmentEvents = assignments
  ? assignments
      .map((item, index) => {
        const parsedDate = parseDateToISO(item.dueDate);
        return parsedDate
          ? {
              id: index,
              title: item.title,
              date: parsedDate,
              url: item.link,
            }
          : null; // skip if no valid date
      })
      .filter((event) => event !== null)
  : [];

  return (
    <div>

      {/* ICalLink Handling */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", fontSize: "16px" }}>
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            name="iCalLink"
            value={iCalLink}
            onChange={(e) => setICalLink(e.target.value)}
            style={styles.iCalInsertionWindow}
            placeholder="Enter your TimeEdit link here..."
          />
          <button
            type="submit"
            style={styles.insertICalButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1a252f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
          >
            Submit
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("iCalLink");
              localStorage.removeItem("aiEvents")
              setICalLink('');
              setICalData([]);
              setAiEvents([]);
            }}
            type="button"
            style={styles.removeICalButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1a252f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
          >
            Reset Links
          </button>
        </div>

      </form>

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}

        initialView={"dayGridMonth"}

        headerToolbar={{
          start: "title",
          center: "",
          end: "dayGridMonth timeGridWeek timeGridDay prev next"
        }}

        eventSources={[
          // Assignments from assignment.json
          {
            events: assignmentEvents
          },
          // Assignments from ICalURL
          {
            events: iCalData
          },
          // AI events
          {
            events: aiEvents
          }
        ]}
      />

      {/* AI Chatbox */}
      <ChatBox />
      
    </div>
  );
}

const styles = {
  removeICalButton: {
    padding: "10px 10px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  insertICalButton: {
    padding: "10px 20px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  iCalInsertionWindow: {
    flex: "1",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
  },
};

export default Calendar;