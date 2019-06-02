import { useRef } from "react";

const useCalendar = () => {
  const calendarRef = useRef(null);

  const updateCalendar = (dateMaybeString, title) => {
    const date =
      typeof dateMaybeString === "string"
        ? new Date(dateMaybeString)
        : dateMaybeString;
    const calendarApi = calendarRef.current && calendarRef.current.getApi();
    if (!calendarApi) {
      // set some ui error maybe?
      return;
    }

    const oldEvent = calendarApi.getEventById(date);
    if (oldEvent) {
      oldEvent.remove();
    }
    if (title) {
      calendarApi.addEvent({
        id: date,
        start: date,
        allDay: true,
        title
      });
    }
  };

  return [calendarRef, updateCalendar];
};

export default useCalendar;
