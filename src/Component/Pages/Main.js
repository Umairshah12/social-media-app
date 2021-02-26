import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import userProfile from "../assets/images/userprofile.png";
import Content from "./Content";
import WritePost from "./WritePost";
import Messages from "./Messages";
import UpdateUser from "./UpdateUser";
// import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { auth } from "../Services/firebase";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  logOutUser,
  fetchUser,
  fetchAllUsers,
  openDailog,
  openUpdateUserDailog,
} from "../Redux/Actions/UserAction";
import {
  openMessagesDailog,
  fetchMessages,
  fetchSpecificUserMessages,
  fetchSinlgeUserProfile,
  fetchRecieverUserMessages,
} from "../Redux/Actions/MessagesAction";
import firebase from "../Services/firebase";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Main(props) {
  let UID = firebase.auth().currentUser.uid;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState("");
  const [userNotification, setUserNotifcation] = React.useState("");

  const dispatch = useDispatch();
  const fetchedUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );
  const users = useSelector((state) => state.UserReducer.users);
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  const specificCountMessage = useSelector(
    (state) => state.MessagesReducer.specificUserMessages
  );

  const recieverMessages = useSelector(
    (state) => state.MessagesReducer.fetchRecieverMessages
  );

  console.log("reciver mESSAGES", recieverMessages);
  console.log("all mESSAGES", specificCountMessage);

  let uid = firebase.auth().currentUser.uid;

  useEffect(() => {
    firebase
      .database()
      .ref(`messages`)
      .on("value", function (snapshot) {
        let alldatamessages = snapshot.val();
        dispatch(fetchMessages(alldatamessages));
      });
  }, []);

  console.log("count", count);
  const specificMessages = (id) => {
    firebase
      .database()
      .ref(`messages/${id}/${uid}`)
      .on("value", function (snapshot) {
        dispatch(fetchSpecificUserMessages(snapshot.val()));
        dispatch(openMessagesDailog(id));
      });

    firebase
      .database()
      .ref(`messages/${uid}/${id}`)
      .on("value", function (snapshot) {
        dispatch(fetchRecieverUserMessages(snapshot.val()));
        dispatch(openMessagesDailog(id));
      });

    firebase
      .database()
      .ref(`users/${id}`)
      .on("value", function (snapshot) {
        dispatch(fetchSinlgeUserProfile(snapshot.val()));
      });
  };

  // useEffect(() => {
  //   firebase
  //     .database()
  //     .ref(`messages/${uid}/count`)
  //     .on("value", function (snapshot) {
  //       setCount(snapshot.val());
  //       // dispatch(fetchRecieverUserMessages(snapshot.val()));
  //       // dispatch(openMessagesDailog(id));
  //     });
  // }, []);

  // Fetching single user record
  useEffect(() => {
    firebase
      .database()
      .ref(`users/${UID}`)
      .on("value", function (snapshot) {
        return dispatch(fetchUser(snapshot.val()));
      });
  }, []);

  const LogOutUser = () => {
    let res = firebase.database().ref(`users/${uid}`).update({
      isOnline: false,
    });
    dispatch(logOutUser(res, auth().signOut()));
  };

  // Fetching all user record
  useEffect(() => {
    firebase
      .database()
      .ref(`users/`)
      .on("value", function (snapshot) {
        if (snapshot.val().id !== uid) {
          return dispatch(fetchAllUsers(snapshot.val()));
        }
      });
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUpdateUser = (id) => {
    dispatch(openUpdateUserDailog(id));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <div className="nav-left">
            <div className="icon-container">
              {currentUser.photoUrl === "" ? (
                <img
                  src={userProfile}
                  alt="media app"
                  className="logo-img"
                  onClick={() => {
                    handleUpdateUser(UID);
                  }}
                />
              ) : (
                <img
                  src={currentUser.photoUrl}
                  alt="media app"
                  className="logo-img"
                  onClick={() => {
                    handleUpdateUser(currentUser.id);
                  }}
                />
              )}

              <div className="logged-in"></div>
            </div>

            <Typography variant="h5" component="h5" className="app-title">
              Social Media App
            </Typography>
          </div>
          <div className="nav-right">
            {auth().currentUser ? (
              <>
                <Link to="/">
                  <Button
                    variant="contained"
                    color="default"
                    className="btn-position"
                    onClick={() => {
                      LogOutUser();
                    }}
                  >
                    Logout
                  </Button>
                </Link>

                <Button
                  variant="contained"
                  color="default"
                  onClick={() => {
                    dispatch(openDailog());
                  }}
                  className="add-post-btn"
                  startIcon={<AddIcon />}
                >
                  ADD POST
                </Button>
              </>
            ) : (
              <>""</>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {users != null &&
            Object.keys(users).map((key) => {
              return (
                <ListItem button key={key}>
                  {uid === users[key].id ? (
                    ""
                  ) : (
                    <>
                      <ListItemIcon
                        onClick={() => {
                          specificMessages(users[key].id);
                          setCount("");
                        }}
                      >
                        <div className="icon-container">
                          {users[key].photoUrl === "" ? (
                            <img
                              src={userProfile}
                              alt="media app"
                              className="logo-img"
                            />
                          ) : (
                            <img
                              src={users[key].photoUrl}
                              alt="media app"
                              className="logo-img"
                            />
                          )}
                          {users[key].isOnline ? (
                            <div className="logged-in"></div>
                          ) : (
                            <div className="logged-out"></div>
                          )}
                        </div>
                      </ListItemIcon>

                      <ListItemText
                        classes={{ root: "listitem-text-root" }}
                        primary={users[key].username}
                      />
                    </>
                  )}

                  {recieverMessages !== null &&
                    Object.keys(recieverMessages).map((item) => {
                      let countedItem = recieverMessages[item].cpunt;
                      // console.log("id", countedItem);

                      return (
                        <>
                          {recieverMessages[item].MessageFrom === users[key].id
                            ? count
                            : ""}
                        </>
                      );
                    })}
                </ListItem>
              );
            })}
        </List>
        <Divider />
      </Drawer>
      <WritePost />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Content />
        <UpdateUser />
        <Messages />
      </main>
    </div>
  );
}

export default Main;
