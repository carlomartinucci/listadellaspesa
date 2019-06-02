import { useRef } from "react";

const useCalendar = () => {
  const calendarRef = useRef(null);

  const updateCalendar = (dateMaybeString, title, customId) => {
    const date =
      typeof dateMaybeString === "string"
        ? new Date(dateMaybeString)
        : dateMaybeString;
    const id = customId || date
    const calendarApi = calendarRef.current && calendarRef.current.getApi();
    if (!calendarApi) {
      // set some ui error maybe?
      return;
    }

    const oldEvent = calendarApi.getEventById(id);
    if (oldEvent) {
      oldEvent.remove();
    }
    if (title) {
      calendarApi.addEvent({
        id: id,
        start: date,
        allDay: true,
        title
      });
    }
    return id
  };

  return [calendarRef, updateCalendar];
};

export default useCalendar;
