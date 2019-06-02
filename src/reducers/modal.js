import { emptyMenu } from "./menu.js";
import produce from 'immer'

export const MODAL_OPEN = "MODAL_OPEN";
export const MODAL_CLOSE = "MODAL_CLOSE";
export const MODAL_UPDATE = "MODAL_UPDATE";
export const MODAL_CHANGE_QUANTITY = "MODAL_CHANGE_QUANTITY";

const modalReducer = (state, action) => {
  if (action.type === MODAL_OPEN) {
    const { date, menu } = action.payload;
    return { isOpen: true, date, menu: menu || emptyMenu };
  } else if (action.type === MODAL_CLOSE) {
    return { isOpen: false, date: null, menu: emptyMenu };
  } else if (action.type === MODAL_UPDATE) {
    const { menuType, menu } = action.payload;
    return { ...state, menu: { ...state.menu, [menuType]: menu || emptyMenu } };
  } else if (action.type === MODAL_CHANGE_QUANTITY) {
    const { menuType, value, deltaQuantity } = action.payload
    return produce(state, draft => {
      const index = draft.menu[menuType].findIndex(option => option.label === value.label)
      if (!draft.menu[menuType][index].quantity) {
        draft.menu[menuType][index].quantity = 0
      }
      draft.menu[menuType][index].quantity += deltaQuantity
      if (draft.menu[menuType][index].quantity < 0) {
        draft.menu[menuType][index].quantity = 0
      }
    })
  } else {
    throw new Error(action.type);
  }
};

export const modalEmptyState = {
  isOpen: false,
  date: null,
  menu: emptyMenu
};

export default modalReducer;
