import { useState } from "react";

const useToggleState = defaultState => {
  const [isState, setIsState] = useState(defaultState);
  const toggleState = event => {
    setIsState(isState => !isState);
  };

  return [isState, toggleState];
};

export default useToggleState;
