import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, FailureError } from "../Redux/Actions/UserAction";
import firebase from "../Services/firebase";
import AddIcon from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";
import { storage } from "../Services/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));

function SignUp() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.UserReducer.error);

  const classes = useStyles();

  const resetFields = () => {
    setPassword("");
    setEmail("");
    setUsername("");
  };

  const handleUpload = (event) => {
    let file = event.target.files[0];
    setImageData(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setPhotoUrl(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const uploadTask = storage.ref(`images/${imageData.name}`).put(imageData);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(imageData.name)
            .getDownloadURL()
            .then((url) => {
              // setImageUrl(url);
            });
        }
      );
      await firebase
        .database()
        .ref("users/" + user.uid)
        .set({
          username,
          id: user.uid,
          email,
          photoUrl,
          isOnline: true,
          // imageUrl,
        });

      dispatch(registerUser(user));
      resetFields();
    } catch (err) {
      dispatch(FailureError(err.message));
      resetFields();
    }
  };

  return (
    <div className="bg">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <label htmlFor="upload-photo">
              <input
                className="img-input"
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={handleUpload}
              />
              <Fab
                color="secondary"
                size="medium"
                className="btn-m"
                component="span"
                aria-label="add"
                variant="extended"
              >
                <AddIcon /> Upload photo
              </Fab>
            </label>
            {error ? <p className="text-danger">{error}</p> : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign uP
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <p>
                  If You have an account? <Link to="/"> Sign In</Link>
                </p>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>{/* <Copyright /> */}</Box>
      </Container>
    </div>
  );
}

export default SignUp;
