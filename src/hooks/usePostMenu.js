import normalize from "json-api-normalizer";
import usePostDataApi from "./usePostDataApi";
import build from "../utils/build";
import endpoint from "../utils/endpoint";

const usePostMenu = () => {
  const [{ isPosting, isError, data }, post] = usePostDataApi(
    endpoint("menus")
  );
  const menu = (data ? build(normalize(data), "menu") : [{}])[0];
  const error = isError ? "Could not post menu" : null;
  const postMenu = menuState => {
    console.log("menuState", menuState);
    const params = {
      menu: {
        menu_goods: [
          { quantity: 2, course: "colazione", name: "latte" },
          { quantity: 1, course: "pranzo", name: "vino" },
          { quantity: 10, course: "cena", name: "birra" },
          { quantity: 0, course: "cena", name: "acqua" }
        ]
      }
    };
    return post(params);
  };

  return [isPosting, error, menu, postMenu];
};

export default usePostMenu;
