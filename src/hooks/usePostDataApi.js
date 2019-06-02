import { useReducer, useEffect } from "react";
import axios from "axios";

// $.get(`/cards`).then(normalize).then((response) => build(response, 'card'))

const dataPostReducer = (state, action) => {
  switch (action.type) {
    case "POST_INIT":
      return {
        ...state,
        params: action.payload.params,
        isPosting: true,
        isError: false
      };
    case "POST_SUCCESS":
      return {
        ...state,
        isPosting: false,
        isError: false,
        data: action.payload
      };
    case "POST_FAILURE":
      return {
        ...state,
        isPosting: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const usePostDataApi = url => {
  const [state, dispatch] = useReducer(dataPostReducer, {
    params: null,
    isPosting: false,
    isError: false,
    data: null
  });

  const post = params => {
    dispatch({ type: "POST_INIT", payload: { params } });
  };

  useEffect(() => {
    let didCancel = false;

    if (state.params) {
      axios
        .post(url, state.params)
        .then(result => {
          if (!didCancel) {
            dispatch({ type: "POST_SUCCESS", payload: result.data });
          }
        })
        .catch(() => {
          if (!didCancel) {
            dispatch({ type: "POST_FAILURE" });
          }
        });
    }

    return () => {
      didCancel = true;
    };
  }, [url, state.params]);

  return [state, post];
};

export default usePostDataApi;
