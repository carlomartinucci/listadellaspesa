import normalize from "json-api-normalizer";
import usePostDataApi from "./usePostDataApi";
import build from "../utils/build";
import endpoint from "../utils/endpoint";

const usePostShopping = () => {
  const [{ isPosting, isError, data }, post] = usePostDataApi(
    endpoint("shoppings")
  );
  const shopping = (data ? build(normalize(data), "shopping") : [{}])[0];
  const error = isError ? "Could not post shopping" : null;
  const postShopping = shoppingState => {
    const params = paramsFromShoppingState(shoppingState)
    return post(params);
  };

  return [isPosting, error, shopping, postShopping];
};

const paramsFromShoppingState = (shoppingState) => {
  console.log("shoppingState", shoppingState);

  const menus = Object.entries(shoppingState).map(([time, menu]) => {
    // console.log('time', time)
    // console.log('menu', menu)
    const eat = new Date(time).getTime() / 1000
    // console.log('eat', eat)
    const breakfastGoods = (menu.breakfast && menu.breakfast.map(option => ({quantity: option.quantity || 0, course: 'colazione', name: option.value}))) || []
    // console.log('breakfastGoods', breakfastGoods)
    const lunchGoods = (menu.lunch && menu.lunch.map(option => ({quantity: option.quantity || 0, course: 'pranzo', name: option.value}))) || []
    // console.log('lunchGoods', lunchGoods)
    const dinnerGoods = (menu.dinner && menu.dinner.map(option => ({quantity: option.quantity || 0, course: 'cena', name: option.value}))) || []
    // console.log('dinnerGoods', dinnerGoods)
    return { eat: eat, menu_goods: [...breakfastGoods, ...lunchGoods, dinnerGoods] }
  })

  const params = {
    shopping: {
      menus
    }
  }

  return params
}

export default usePostShopping;
