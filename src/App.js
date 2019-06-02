import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Loading from "./components/Loading";
import TopNavBar from "./components/TopNavBar";

import "./App.css";

// menu di oggi
const Calendar = lazy(() => import("./components/Calendar"));

// prepara il menu / la spesa
const Shopping = lazy(() => import("./components/Shopping"));

// la tua lista della spesa
const ShoppingList = lazy(() => import("./pages/ShoppingList"));

// backoffice con i crud
const Backoffice = lazy(() => import("./components/Backoffice"));

const App = () => (
  <Router>
    <div className="App">
      <TopNavBar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/calendar" />} />
          <Route exact path="/calendar" component={Calendar} />
          <Route exact path="/shopping" component={Shopping} />
          <Route exact path="/shopping-list" component={ShoppingList} />
          <Route path="/backoffice" component={Backoffice} />
        </Switch>
      </Suspense>
    </div>
  </Router>
);

export default App;
