import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../Services/firebase";
import { Fab } from "@material-ui/core";
import userProfile from "../assets/images/userprofile.png";
import ImageIcon from "@material-ui/icons/Image";

import {
  closeUpdateUserDailog,
  UpdateCurrentUser,
} from "../Redux/Actions/UserAction";
export default function UpdateUser() {
  const fetchedUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  const [userName, setUserName] = useState("");
  const [updateUserImage, setUpdateUserImage] = useState("");
  const [updateimagefile, setUpdateImageFile] = useState("");
  const [updatefiletype, setUpdateFileType] = useState("");
  const [updateimageName, setUpdateImageName] = useState("");
  const [userPostImage, setUserPostImage] = useState("");
  const dispatch = useDispatch();

  let Uid = firebase.auth().currentUser.uid;
  const openUserDailog = useSelector(
    (state) => state.UserReducer.userUpdateDailog
  );

  useEffect(() => {
    firebase
      .database()
      .ref(`users/${Uid}`)
      .on("value", function (snapshot) {
        setUserName(snapshot.val().username);
        setUserPostImage(snapshot.val().photoUrl);
      });
  }, []);

  const handleUploadUserImage = (event) => {
    let file = event.target.files[0];
    setUpdateImageFile(file);
    setUpdateImageName(file.name);
    setUpdateFileType(file.type);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setUserPostImage(reader.result);
    };
  };

  const handleUpdateUser = () => {
    let userUpdate = "";
    userUpdate = firebase.database().ref(`users/${Uid}`).update({
      username: userName,
    });
    if (userPostImage) {
      userUpdate = firebase.database().ref(`users/${Uid}`).update({
        photoUrl: userPostImage,
      });
    }
    dispatch(UpdateCurrentUser(userUpdate));
  };

  return (
    <div>
      <Dialog
        classes={{ paper: "update-user-dailog" }}
        fullWidth={true}
        onClose={() => {
          dispatch(closeUpdateUserDailog());
        }}
        open={openUserDailog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          className="card-action-border post-title"
          id="form-dialog-title"
        >
          Update User
        </DialogTitle>
        <DialogContent>
          <div className="userpic-container">
            <div className="user-update-pic">
              {userPostImage === "" ? (
                <img
                  src={userProfile}
                  alt="user Image"
                  className="user-update-logo"
                />
              ) : (
                <img
                  src={userPostImage}
                  alt="user Image"
                  className="user-update-logo"
                />
              )}
            </div>
          </div>
          <TextField
            id="filled-password-input"
            label="user Name"
            type="text"
            className="update-user-input"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            autoComplete="current-password"
            variant="filled"
            fullWidth
          />
        </DialogContent>
        <DialogActions className="dailog-action card-action-border">
          <div className="gallery-input">
            <input
              accept="video/*,image/*"
              className="image-input"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadUserImage}
            />
            <label className="label-size" htmlFor="contained-button-file">
              <Fab component="span">
                <ImageIcon />
              </Fab>
            </label>
          </div>
          <div>
            <Button
              className="action-cancel"
              variant="contained"
              autoFocus
              onClick={() => {
                dispatch(closeUpdateUserDailog());
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              autoFocus
              onClick={() => {
                handleUpdateUser();
              }}
              color="primary"
            >
              Update User
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
