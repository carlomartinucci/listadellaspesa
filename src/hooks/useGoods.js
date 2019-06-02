import normalize from "json-api-normalizer";

import useDataApi from "./useDataApi";
import build from "../utils/build";
import endpoint from "../utils/endpoint";

const useGoods = initialGoods => {
  const [{ isLoading, isError, data }] = useDataApi(
    endpoint("goods"),
    initialGoods || []
  );
  const goods = build(normalize(data), "good") || [];
  const error = isError ? "Could not fetch" : null;

  return [isLoading, error, goods];
};

export default useGoods;
