import React, { useEffect, useState } from "react";
import "./App.css";
import "./Component/assets/style.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import SignUp from "./Component/Pages/SignUp";
import SignIn from "./Component/Pages/SignIn";
import Content from "./Component/Pages/Content";
import Main from "./Component/Pages/Main";
import Navbar from "./Component/Pages/Navbar";
import firebase from "./Component/Services/firebase";

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/main" />
        )
      }
    />
  );
}

function App(props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return loading === true ? (
    <Button variant="primary" disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Loading...
    </Button>
  ) : (
    <Router>
      {/* <Navbar /> */}
      <Switch>
        {/* <Route exact path="/" render={(props) => <Home {...props} />} /> */}
        {/* <PrivateRoute
          exact
          path="/content"
          component={Content}
          authenticated={authenticated}
        /> */}
        <PrivateRoute
          exact
          path="/main"
          component={Main}
          authenticated={authenticated}
        />
        <PublicRoute
          exact
          path="/signUp"
          component={SignUp}
          authenticated={authenticated}
        />
        <PublicRoute
          exact
          path="/"
          component={SignIn}
          authenticated={authenticated}
        />
      </Switch>
    </Router>
  );
}

export default App;
