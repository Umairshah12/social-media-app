import React from "react";
import mediaImg from "../assets/images/social-media-app2.jpg";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { auth } from "../Services/firebase";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { logOutUser } from "../Redux/Actions/UserAction";

function Navbar() {
  const dispatch = useDispatch();
  return (
    <div className="nav nav-bg">
      <div className="nav-content">
        <div className="nav-container">
          <div className="nav-left">
            <img src={mediaImg} alt="media app" className="logo-img" />

            <Typography variant="h5" component="h4" className="app-title">
              Social Media App
            </Typography>
          </div>

          <div className="nav-right">
            {auth().currentUser ? (
              <>
                <Link to="/">
                  <Button
                    color="secondary"
                    className="btn-position"
                    onClick={() => {
                      dispatch(logOutUser(auth().signOut()));
                    }}
                  >
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/">
                  <Button color="primary">SignIn</Button>
                </Link>
                <Link to="/signUp">
                  <Button color="secondary">SignUp</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
