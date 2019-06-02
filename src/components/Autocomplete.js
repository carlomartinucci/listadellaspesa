import React from "react";
import CreatableSelect from "react-select/lib/Creatable";

const Autocomplete = props => (
  <CreatableSelect isMulti isClearable {...props} />
);

export default Autocomplete;
