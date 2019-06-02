import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Row, Col } from "reactstrap";
import dayjs from "dayjs";

import "../styles/calendar.scss";

const header = {
  left: "title",
  center: "",
  right: "prev,next"
};
const views = {
  dayGridThreeDay: {
    type: 'dayGrid',
    dayCount: 3,
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

const Calendar = props => (
  <Container fluid>
    <FullCalendar
      defaultView="dayGridThreeDay"
      themeSystem="bootstrap"
      header={header}
      views={views}
      plugins={plugins}
      locale={itLocale}
      contentHeight="auto"
      dateClick={console.log}
      events={[]}
      eventClick={eventClick}
      // customButtons={customButtons}
    />
  </Container>
);

export default Calendar;
