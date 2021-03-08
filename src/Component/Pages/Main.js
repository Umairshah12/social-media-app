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
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import userProfile from "../assets/images/userprofile.png";
import Content from "./Content";
import AccountCircle from "@material-ui/icons/AccountCircle";
import WritePost from "./WritePost";
import Messages from "./Messages";
import UpdateUser from "./UpdateUser";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { auth } from "../Services/firebase";
import contentBg from "../assets/images/chat-img5.jpg";
import AddCircleIcon from "@material-ui/icons/AddCircle";
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
  fetchSinlgeUserProfile,
  fetchRecieverUserMessages,
  getChatKey,
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
    minHeight: 722,
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundImage: `url(${contentBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
}));

function Main(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [progressLoading, setProgressLoading] = React.useState(true);

  const dispatch = useDispatch();
  const users = useSelector((state) => state.UserReducer.users);
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  let uid = firebase.auth().currentUser.uid;

  useEffect(() => {
    firebase
      .database()
      .ref(`messages`)
      .on("value", function (snapshot) {
        let alldatamessages = snapshot.val();
        dispatch(fetchMessages(alldatamessages));
        setProgressLoading(false);
      });
  }, [dispatch]);

  const specificMessages = (key) => {
    let chatKey = "";
    let friendList = { friendId: key, userId: uid };
    let db = firebase.database().ref("friend_list");
    let flag = false;
    db.on("value", function (friends) {
      friends.forEach(function (data) {
        let user = data.val();
        if (
          (user.friendId === friendList.friendId &&
            user.userId === friendList.userId) ||
          (user.friendId === friendList.userId &&
            user.userId === friendList.friendId)
        ) {
          flag = true;
          chatKey = data.key;
        }
      });
      if (flag === false) {
        chatKey = firebase
          .database()
          .ref("friend_list")
          .push(friendList)
          .getKey();
      }
      dispatch(openMessagesDailog(key));
      dispatch(getChatKey(chatKey));
      setProgressLoading(false);

      let chatdb = firebase.database().ref(`Chat-Messages/${chatKey}`);
      chatdb.on("value", function (loadchat) {
        let chats = loadchat.val();
        dispatch(fetchRecieverUserMessages(chats));
      });
    });

    firebase
      .database()
      .ref(`users/${key}`)
      .on("value", function (snapshot) {
        dispatch(fetchSinlgeUserProfile(snapshot.val()));
        setProgressLoading(false);
      });
  };

  // Fetching single user record
  useEffect(() => {
    firebase
      .database()
      .ref(`users/${uid}`)
      .on("value", function (snapshot) {
        dispatch(fetchUser(snapshot.val()));
      });
  }, [dispatch, uid]);

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
          dispatch(fetchAllUsers(snapshot.val()));
        }
      });
  }, [dispatch, uid]);

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
    <>
      {progressLoading === true ? (
        <div className="circular-progressBar">
          <CircularProgress className="progressbar-design" />
        </div>
      ) : (
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
                  {currentUser.photoUrl === "" || null ? (
                    <img
                      src={userProfile}
                      alt="media app"
                      className="logo-img"
                      onClick={() => {
                        handleUpdateUser(uid);
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

                <Typography variant="h6" component="h6" className="app-title">
                  Social Media App
                </Typography>
              </div>
              <div className="nav-right">
                {auth().currentUser ? (
                  <>
                    <Link to="/">
                      <AccountCircle
                        onClick={() => {
                          LogOutUser();
                        }}
                        className="btn-position"
                      />
                    </Link>
                    <AddCircleIcon
                      onClick={() => {
                        dispatch(openDailog());
                      }}
                      className="add-post-btn"
                    />
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
                              specificMessages(key);
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
      )}
    </>
  );
}

export default Main;
