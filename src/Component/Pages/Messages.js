import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import firebase from "../Services/firebase";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import CommentContent from "../Pages/CommentContent";
import ImageIcon from "@material-ui/icons/Image";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MessagesContent from "../Pages/MessagesContent";
import { Fab } from "@material-ui/core";
import { storage } from "../Services/firebase";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import userProfile from "../assets/images/userprofile.png";

import {
  closeMessagesDailog,
  sendMessages,
  RemoveMessage,
} from "../Redux/Actions/MessagesAction";

import { FailureError } from "../Redux/Actions/UserAction";

function Messages(props) {
  const [postMessage, setPostMessage] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [messageImageName, setMessageImageName] = useState("");
  const [messageImageType, setMessageImageType] = useState("");
  const [messagePostImage, setMessagePostImage] = useState("");
  const dispatch = useDispatch();
  const open = useSelector((state) => state.MessagesReducer.MessagesDailog);
  const UserMessageId = useSelector(
    (state) => state.MessagesReducer.UserMessageId
  );
  const users = useSelector((state) => state.UserReducer.users);
  const UsersMessages = useSelector(
    (state) => state.MessagesReducer.specificUserMessages
  );
  const userProfile = useSelector(
    (state) => state.MessagesReducer.UserProfileData
  );

  let uid = firebase.auth().currentUser.uid;

  const handleUploadMessageImage = (event) => {
    let file = event.target.files[0];
    setMessageFile(file);
    setMessageImageName(file.name);
    setMessageImageType(file.type);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setMessagePostImage(reader.result);
    };
  };

  const uploadImage = () => {
    const uploadTask = storage
      .ref(`messagesImages/${messageFile.name}`)
      .put(messageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("messagesImages")
          .child(messageFile.name)
          .getDownloadURL()
          .then((url) => {
            // setImageUrl(url);
          });
      }
    );
  };

  const handleDeleteComment = async (key, data) => {
    try {
      let Result = await firebase
        .database()
        .ref(`messages/${UserMessageId}/${key}`)
        .remove();
      Result = await firebase.storage().ref(`messagesImages/${data}`).delete();
      setMessageImageName("");
      return dispatch(RemoveMessage(Result));
    } catch (error) {
      dispatch(FailureError(error.message));
    }
  };

  const clearFields = () => {
    setPostMessage("");
    setMessageImageName("");
    setMessageImageType("");
    setMessagePostImage("");
    setMessageFile("");
  };

  let timestamp = moment().format("h:mm a");

  const sendMessage = () => {
    // e.preventDefault();
    if (messageFile) {
      uploadImage();
    }
    let newMessage = firebase.database().ref(`messages/${UserMessageId}`);
    newMessage.push({
      MessageFrom: uid,
      MessagetoId: UserMessageId,
      postMessage: postMessage,
      timestamp: timestamp,
      messageImage: messagePostImage,
      messageImageName,
      messageImageType,
    });
    dispatch(sendMessages(newMessage));
    clearFields();
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        onClose={() => {
          dispatch(closeMessagesDailog());
        }}
        aria-labelledby="form-dialog-title"
        open={open}
      >
        <DialogTitle
          classes={{ root: "message-header" }}
          className="comment-header"
          id="form-dialog-title"
        >
          <ListItem>
            <ListItemIcon>
              <div className="icon-container">
                {userProfile.photoUrl === "" ? (
                  <img src={userProfile} alt="media app" className="logo-img" />
                ) : (
                  <img
                    src={userProfile.photoUrl}
                    alt="media app"
                    className="logo-img"
                  />
                )}
                {userProfile.isOnline ? (
                  <div className="logged-in"></div>
                ) : (
                  <div className="logged-out"></div>
                )}
              </div>
            </ListItemIcon>
            <ListItemText
              classes={{ root: "listitem-text-root" }}
              primary={userProfile.username}
            />
          </ListItem>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <div>
              {/* {error ? <p className="text-danger">{error}</p> : null}  */}
              {UsersMessages != null && Object.keys(UsersMessages).length > 0
                ? Object.keys(UsersMessages).map((key) => {
                    let postMessage = UsersMessages[key].postMessage;
                    let messageImage = UsersMessages[key].messageImage;
                    let UserId = UsersMessages[key].MessageFrom;
                    let messageImageType = UsersMessages[key].messageImageType;

                    return (
                      <div key={key}>
                        <MessagesContent
                          key={key}
                          postMessage={postMessage}
                          id={UserId}
                          messageImage={messageImage}
                          messageImageType={messageImageType}
                        />
                        <div className="commment-post-time">
                          <IconButton
                            className="comment-btn"
                            aria-label="message"
                            onClick={() => {
                              handleDeleteComment(
                                key,
                                UsersMessages[key].messageImageName &&
                                  UsersMessages[key].messageImageName
                              );
                            }}
                          >
                            <DeleteOutlineIcon classes={{ root: "svg-icon" }} />
                            Delete Message
                          </IconButton>
                          {UsersMessages[key].timestamp}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => {
              setPostMessage(e.target.value);
            }}
            label="Send Message"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions className="comment-actions">
          <div className="gallery-input">
            <input
              accept="video/*,image/*"
              className="image-input"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadMessageImage}
            />
            <label className="label-size" htmlFor="contained-button-file">
              <Fab component="span">
                <ImageIcon />
              </Fab>
            </label>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(closeMessagesDailog());
              }}
              color="secondary"
              className="action-cancel"
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={sendMessage} color="primary">
              Send
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Messages;
