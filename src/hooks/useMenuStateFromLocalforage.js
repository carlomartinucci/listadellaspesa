import { useRef, useEffect } from "react";
import localforage from "localforage";
import calendarTitleFromMenu from "../utils/calendarTitleFromMenu";
import { MENU_LOAD_STORAGE } from "../reducers/menu.js";

const useMenuStateFromLocalforage = ({
  calendarRef,
  menuDispatch,
  updateCalendar,
  menuState
}) => {
  const menuStateLoaded = useRef(false);
  if (!menuStateLoaded.current && calendarRef.current) {
    menuStateLoaded.current = true;
    localforage
      .getItem("menu")
      .then(serverMenuState => {
        const menuState = serverMenuState || {}
        menuDispatch({ type: MENU_LOAD_STORAGE, payload: { menuState } });
        Object.entries(menuState).forEach(([date, menu]) => {
          updateCalendar(date, calendarTitleFromMenu(menu));
        });
      })
      .catch(console.error);
  }
  useEffect(() => {
    if (menuStateLoaded.current) {
      localforage.setItem("menu", menuState);
    }
  }, [menuState]);
};

export default useMenuStateFromLocalforage;
