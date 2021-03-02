import React, { useEffect, useState } from "react";
import "./App.css";
import "./Component/assets/style.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import SignUp from "./Component/Pages/SignUp";
import SignIn from "./Component/Pages/SignIn";
import CircularProgress from "@material-ui/core/CircularProgress";
import Main from "./Component/Pages/Main";
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
        const messaging = firebase.messaging();
        messaging
          .requestPermission()
          .then(function () {
            return messaging.getToken();
          })
          .then(function (token) {
            firebase
              .database()
              .ref("fcmToken")
              .child(user.uid)
              .set({ token_id: token });
          })
          .catch((err) => {
            console.log("error", err);
          });

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
    <div className="circular-progressBar">
      <CircularProgress className="progressbar-design" />
    </div>
  ) : (
    <Router>
      <Switch>
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
