import gql from "graphql-tag";
import { useState, useEffect } from "react";

const GET_GOODS = gql`
  query goods {
    goods {
      id
      name
      shelf
    }
  }
`;

const useLoadShoppingOptions = client => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    client
      .query({
        query: GET_GOODS
      })
      .then(response => console.log(response) || response.data.goods)
      .then(goods => {
        console.log(goods);
        return goods.map(good => ({ value: good.name, label: good.name }));
      })
      .then(setOptions);
  }, [client]);

  return [options, setOptions];
};

export default useLoadShoppingOptions;
