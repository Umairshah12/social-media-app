import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
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
  const [userName, setUserName] = useState("");
  const [updateUserImage, setUpdateUserImage] = useState("");
  const [updateimagefile, setUpdateImageFile] = useState("");
  // const [updatefiletype, setUpdateFileType] = useState("");
  const [updateimageName, setUpdateImageName] = useState("");
  const [userPostImage, setUserPostImage] = useState("");
  const dispatch = useDispatch();

  let Uid = firebase.auth().currentUser.uid;
  const openUserDailog = useSelector(
    (state) => state.UserReducer.userUpdateDailog
  );

  console.log("image file", updateimagefile);
  useEffect(() => {
    firebase
      .database()
      .ref(`users/${Uid}`)
      .on("value", function (snapshot) {
        setUserName(snapshot.val().username);
        setUserPostImage(snapshot.val().photoUrl);
      });
  }, [Uid]);

  const handleUploadUserImage = (event) => {
    let file = event.target.files[0];
    setUpdateImageFile(file);
    setUpdateImageName(file.name);
    // setUpdateFileType(file.type);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setUserPostImage(reader.result);
    };
  };

  const onKeyDown = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      handleUpdateUser();
    }
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
    if (updateimagefile) {
      userUpdate = firebase.database().ref(`users/${Uid}`).update({
        FileImage: updateimagefile.name,
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

          <input
            id="textcomment"
            type="text"
            placeholder="Type Here..."
            className="form-control chat-input"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            onKeyDown={(e) => {
              onKeyDown(e);
            }}
          ></input>
          <div>
            <Button
              variant="contained"
              autoFocus
              onClick={() => {
                handleUpdateUser();
              }}
              color="primary"
            >
              Update
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
