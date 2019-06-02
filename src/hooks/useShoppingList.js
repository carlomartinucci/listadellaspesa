import { useEffect, useReducer } from 'react';
import produce from 'immer';
import useDataApi from "./useDataApi";
import usePostDataApi from "./usePostDataApi";
import endpoint from "../utils/endpoint";

const initialItems = []
const initialShoppingList = {
  items: initialItems
}
const initialShoppingListState = {
  shoppingList: initialShoppingList
}

const reducer = produce((draft, action) => {
  let index
  switch (action.type) {
  case "CLEAR":
    return initialShoppingListState;
  case "FETCH":
    draft.shoppingList = action.payload.shoppingList;
    return
  case "SET_ITEM_STATE":
    index = draft.shoppingList.items.findIndex(item => item.name === action.payload.item.name)
    draft.shoppingList.items[index].state = action.payload.state
    return
  default:
    throw new Error();
  }
})

const useShoppingList = initialGoods => {
  const [shoppingListState, dispatch] = useReducer(reducer, initialShoppingListState)

  const [{ data }] = useDataApi(
    endpoint("shopping_lists/current"), null
  );
  useEffect(() => {
    if (data) {
      dispatch({type: 'FETCH', payload: {shoppingList: data}})
    }
  }, [data])
  const [postState, post] = usePostDataApi((endpoint("shopping_lists")))

  const setItemState = (item, state) => () => dispatch({ type: 'SET_ITEM_STATE', payload: {item, state}})

  const setDone = () => {
    post({ items: [1,2,3]})
    dispatch({ type: 'CLEAR' })
  }

  return [shoppingListState.shoppingList, setItemState, setDone];
};

export default useShoppingList;
