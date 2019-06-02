export const menuEmptyState = {};

export const emptyMenu = { breakfast: [], lunch: [], dinner: [] };

export const MENU_UPDATE = "MENU_UPDATE";
export const MENU_LOAD_STORAGE = "MENU_LOAD_STORAGE";
export const MENU_RESET = "MENU_RESET";

const menuReducer = (state, action) => {
  if (action.type === MENU_UPDATE) {
    const { date, menu } = action.payload;
    return { ...state, [date]: menu };
  } else if (action.type === MENU_LOAD_STORAGE) {
    return action.payload.menuState;
  } else if (action.type === MENU_RESET) {
    return menuEmptyState;
  } else {
    throw new Error(action.type);
  }
};

export default menuReducer;
