import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import { Container } from "reactstrap";
import normalize from "json-api-normalizer";
// import {formatDate} from "../utils/dayjs";

import useCalendar from "../hooks/useCalendar";
import useDataApi from "../hooks/useDataApi";
import endpoint from "../utils/endpoint";
import build from "../utils/build";

import "../styles/calendar.scss";

const header = {
  left: "title",
  center: "",
  right: "prev,next"
};
const views = {
  dayGridThreeDay: {
    type: 'dayGrid',
    duration: { days: 3 }
    // dayCount: 3,
    // visibleRange: (currentDate) => {
    //   return {
    //     start: dayjs(currentDate).subtract(1, 'day').format('YYYY-MM-DD'),
    //     end: dayjs(currentDate).add(2, 'day').format('YYYY-MM-DD')
    //   };
    // }
  }
}

// const customButtons = {
//   info: {
//     text: "?",
//     click() {
//       alert("info shown!");
//     }
//   }
// };
const plugins = [dayGridPlugin, interactionPlugin];

const eventClick = info => {
  console.log(info.event);
};

const calendarEventsFromData = (data) => {
  if (!data) return []
  const menus = build(normalize(data), 'menu')

  const filtered = menus.filter(menu => menu.eat)
  const calendarEvents = filtered.reduce((events, menu) => {
    events.push(...menu.menuGoods.map(menuGood => {
      return {
        id: menuGood.id,
        date: new Date(menu.eat * 1000),
        title: `${menuGood.name} (${menuGood.quantity})`
      }
    }))
    return events
  }, [])
  return calendarEvents
}

const Calendar = props => {
  const [calendarRef, updateCalendar] = useCalendar();
  const [{ data }] = useDataApi(endpoint("menus"))
  const calendarEvents = calendarEventsFromData(data)

  useEffect(() => {
    calendarEvents.forEach(calendarEvent => {
      updateCalendar(calendarEvent.date, calendarEvent.title, calendarEvent.id)
    })
  }, [calendarRef, updateCalendar, calendarEvents])

  return <Container fluid>
    <FullCalendar
      ref={calendarRef}
      defaultView="dayGridThreeDay"
      themeSystem="bootstrap"
      header={header}
      views={views}
      plugins={plugins}
      locale={itLocale}
      contentHeight="auto"
      // dateClick={console.log}
      events={[]}
      eventClick={eventClick}
      // customButtons={customButtons}
    />
  </Container>
};

export default Calendar;
