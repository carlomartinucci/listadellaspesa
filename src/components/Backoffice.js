import React, { Suspense, lazy } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Loading from "./Loading";

const Goods = lazy(() => import("./backoffice/Goods"));

const Backoffice = () => (
  <Suspense fallback={<Loading />}>
    <div>BACKOFFICE!</div>
    <Switch>
      <Route path="/backoffice/goods" component={Goods} />
      <Route component={Index} />
    </Switch>
  </Suspense>
)

const Index = () => <div>
  <Link to="/backoffice/goods">
    Goods
  </Link>
</div>

export default Backoffice
