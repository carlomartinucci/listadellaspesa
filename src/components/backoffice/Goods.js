import React from "react";
import useGoods from "../../hooks/useGoods";
import Loading from "../Loading";

const Goods = props => {
  const [isLoading, error, goods] = useGoods();

  if (isLoading) return <Loading />;
  if (error) return <p>ERROR {error}</p>;

  return (
    <React.Fragment>
      {goods.map(good => (
        <p key={good.id}>{good.name}</p>
      ))}
    </React.Fragment>
  );
};

export default Goods;
