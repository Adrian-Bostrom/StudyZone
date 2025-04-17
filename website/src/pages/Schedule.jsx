import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import iCalendarPlugin from '@fullcalendar/icalendar'

//import assignments from "../../data/assignments.json";

function Calendar() {

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin ]}

        initialView={"dayGridMonth"}

        headerToolbar={{
          start: "title",
          center: "",
          end: "today, dayGridMonth, timeGridWeek, timeGridDay, prev next,"
        }}

        events={{
          url: 'https://cloud.timeedit.net/kth/web/stud02/ri.ics?sid=7&p=4&objects=386269.16&l=sv&e=2408&ku=20643&k=2EECEF00B3BF2D11545D7F3CF1A002D8DB',
          format: 'ics'
        }}
        
        /*
        events={{
          {assignments.map((item, index) => (
            key={index}
            title={item.title}
            start={item.dueDate}
            url={item.link}
          ))}
        }}
        */
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