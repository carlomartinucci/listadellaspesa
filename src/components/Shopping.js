import React, { useReducer, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, FormGroup, Label, Badge, Button, Row, Col } from "reactstrap";
import GenericModal from "./GenericModal";
// import useShopping from "../hooks/useShopping";
import useGoods from "../hooks/useGoods";
import usePostShopping from "../hooks/usePostShopping";
import useCalendar from "../hooks/useCalendar";
import useMenuStateFromLocalforage from "../hooks/useMenuStateFromLocalforage";
import calendarTitleFromMenu from "../utils/calendarTitleFromMenu";
import "../styles/calendar.scss";
import { formatDate } from "../utils/dayjs";
import Autocomplete from "./Autocomplete";

import modalReducer, {
  modalEmptyState,
  MODAL_OPEN,
  MODAL_CLOSE,
  MODAL_UPDATE,
  MODAL_CHANGE_QUANTITY
} from "../reducers/modal.js";
import menuReducer, {
  menuEmptyState,
  MENU_UPDATE,
  MENU_RESET
} from "../reducers/menu.js";

const header = {
  left: "title",
  center: "",
  right: "prev,next"
};
const plugins = [dayGridPlugin, interactionPlugin];

const useShoppingOptions = () => {
  const [, , serverGoods] = useGoods();
  const [clientOptions, setClientOptions] = useState([]);
  const options = serverGoods
    .map(good => ({ value: good.name, label: good.name }))
    .concat(clientOptions);
  return [setClientOptions, options];
};

const Shopping = props => {
  const [calendarRef, updateCalendar] = useCalendar();

  const [setClientOptions, options] = useShoppingOptions();

  const [modalState, modalDispatch] = useReducer(modalReducer, modalEmptyState);
  const [menuState, menuDispatch] = useReducer(menuReducer, menuEmptyState);
  useMenuStateFromLocalforage({
    calendarRef,
    menuDispatch,
    updateCalendar,
    menuState
  });

  const [
    isPostingShopping,
    errorShopping,
    shopping,
    postShopping
  ] = usePostShopping();

  // const { shopping } = useShopping();

  const handleModalSubmit = () => {
    updateCalendar(modalState.date, calendarTitleFromMenu(modalState.menu));
    const menuPayload = { date: modalState.date, menu: modalState.menu };
    menuDispatch({ type: MENU_UPDATE, payload: menuPayload });
    modalDispatch({ type: MODAL_CLOSE });
  };

  const handleMenuSubmit = event => {
    Object.keys(menuState).forEach(date => {
      updateCalendar(date);
    });
    postShopping(menuState);
    menuDispatch({ type: MENU_RESET });
  };

  return (
    <Container>
      <FullCalendar
        ref={calendarRef}
        defaultView="dayGridMonth"
        header={header}
        plugins={plugins}
        locale={itLocale}
        contentHeight="auto"
        dateClick={dateEvent =>
          modalDispatch({
            type: MODAL_OPEN,
            payload: { date: dateEvent.date, menu: menuState[dateEvent.date] }
          })
        }
        eventClick={eventEvent =>
          modalDispatch({
            type: MODAL_OPEN,
            payload: {
              date: eventEvent.event.start,
              menu: menuState[eventEvent.event.start]
            }
          })
        }
        events={[]}
      />

      <Button
        color="primary"
        disabled={isPostingShopping}
        onClick={isPostingShopping ? undefined : handleMenuSubmit}
      >
        {isPostingShopping ? "INVIANDO..." : "INVIA!"}
      </Button>

      <h3>Menu</h3>
      <p>TODO: sort</p>
      {menuState && Object.entries(menuState).map(([date, { breakfast, lunch, dinner }]) => (
        <div key={date}>
          <h4>{formatDate(date)}</h4>
          <p className="mb-0">
            Colazione: {breakfast.map(value => value.label).join(", ")}
          </p>
          <p className="mb-0">
            Pranzo: {lunch.map(value => value.label).join(", ")}
          </p>
          <p className="mb-0">
            Cena: {dinner.map(value => value.label).join(", ")}
          </p>
        </div>
      ))}

      <ShoppingModal
        modalDispatch={modalDispatch}
        options={options}
        setClientOptions={setClientOptions}
        modalState={modalState}
        handleModalSubmit={handleModalSubmit}
        />
    </Container>
  );
};

const ShoppingModal = props => {
  const {modalDispatch, options, setClientOptions, modalState, handleModalSubmit} = props
  const handleModalToggle = event => {
    modalDispatch({ type: MODAL_CLOSE });
  };
  const handleChangeQuantity = (menuType, value, deltaQuantity) => event => {
    modalDispatch({type: MODAL_CHANGE_QUANTITY, payload: {menuType, value, deltaQuantity}})
  }
  const handleBreakfast = breakfast =>
    modalDispatch({
      type: MODAL_UPDATE,
      payload: {
        menuType: "breakfast",
        menu: breakfast
      }
    });
  const breakfastProps = autocompleteProps(
    options,
    setClientOptions,
    modalState.menu && modalState.menu.breakfast,
    handleBreakfast
  );

  const handleLunch = lunch =>
    modalDispatch({
      type: MODAL_UPDATE,
      payload: {
        menuType: "lunch",
        menu: lunch
      }
    });
  const lunchProps = autocompleteProps(
    options,
    setClientOptions,
    modalState.menu && modalState.menu.lunch,
    handleLunch
  );

  const handleDinner = dinner =>
    modalDispatch({
      type: MODAL_UPDATE,
      payload: {
        menuType: "dinner",
        menu: dinner
      }
    });
  const dinnerProps = autocompleteProps(
    options,
    setClientOptions,
    modalState.menu && modalState.menu.dinner,
    handleDinner
  );

  return (
    <GenericModal
    key={modalState.date}
    isOpen={modalState.isOpen}
    toggle={handleModalToggle}
    onSubmit={handleModalSubmit}
    title={formatDate(modalState.date)}
  >
    <FormGroup>
      <Label for="colazione">Colazione</Label>
      <Autocomplete name="colazione" {...breakfastProps} />
    </FormGroup>
    <FormGroup>
      <Label for="pranzo">Pranzo</Label>
      <Autocomplete name="pranzo" {...lunchProps} />
    </FormGroup>
    <FormGroup>
      <Label for="cena">Cena</Label>
      <Autocomplete name="cena" {...dinnerProps} />
    </FormGroup>

    <Row>
      <Col>
        {Object.entries(modalState.menu).map(([menuType, values]) => (
          <p key={menuType} className="mb-0">
            {menuType}: {values.map(value => (
              <span key={value.label}>
                <Button outline size="sm" onClick={handleChangeQuantity(menuType, value, -1)}>-1</Button>
                  {value.label} <Badge pill>{value.quantity || 0}</Badge>
                <Button outline size="sm" onClick={handleChangeQuantity(menuType, value, +1)}>+1</Button>
              </span>
            ))}
          </p>
        ))}

      </Col>
    </Row>
  </GenericModal>
)}

const autocompleteProps = (options, setClientOptions, value, setValue) => {
  const handleCreate = label => {
    const newValue = { value: label, label };
    setClientOptions([...options, newValue]);
    setValue([...value, newValue]);
  };

  return {
    onChange: setValue,
    onCreateOption: handleCreate,
    options,
    value,
    isLoading: options == null
  };
};

export default Shopping;
