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
import $ from "jquery";
import { Fab } from "@material-ui/core";
import { storage } from "../Services/firebase";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
// import { Recorder } from "react-voice-recorder";
// import "react-voice-recorder/dist/index.css";
// import userImg from "../assets/images/social-media-bg3.png";

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
  const [messengerSound, setMessengerSound] = useState(false);
  const [messagePostImage, setMessagePostImage] = useState("");
  // const [allMessages, setAllMessages] = useState({});
  const [number, setNumber] = useState({});
  const dispatch = useDispatch();
  const currentUserImage = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  // console.log("current user image", currentUserImage);
  const open = useSelector((state) => state.MessagesReducer.MessagesDailog);
  const UserMessageId = useSelector(
    (state) => state.MessagesReducer.UserMessageId
  );

  let apiKey =
    "AAAAZPe9IZ0:APA91bE1IJq_ohIsKv0KvhEi5JwVBnx8FjKMKtUeJlKhABx4LTDL0WKxNYcH21kN79j03_obyk7dHLSDTV0TL4OkZCbKKpDPiQj5GVnXPNxopQYHIfvN8Ol1jRTcJNChplCc3SFZPDwl";
  const users = useSelector((state) => state.UserReducer.users);
  const allMessages = useSelector(
    (state) => state.MessagesReducer.specificUserMessages
  );
  const recieverMessages = useSelector(
    (state) => state.MessagesReducer.fetchRecieverMessages
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

  const handleDeleteMessage = async (key, data) => {
    try {
      let Result = await firebase
        .database()
        .ref(`messages/${UserMessageId}/${uid}/${key}`)
        .remove();
      // Result = await firebase.storage().ref(`messagesImages/${data}`).delete();
      setMessageImageName("");
      return dispatch(RemoveMessage(Result));
    } catch (error) {
      dispatch(FailureError(error.message));
    }
  };

  const handleDeleteRecieverMessage = async (key, data) => {
    try {
      let Result = await firebase
        .database()
        .ref(`messages/${uid}/${UserMessageId}/${key}`)
        .remove();
      // Result = await firebase.storage().ref(`messagesImages/${data}`).delete();
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

  const onKeyDown = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (messageFile) {
      uploadImage();
    }

    let ChatMessages = {
      MessageFrom: uid,
      MessagetoId: UserMessageId,
      postMessage: postMessage,
      timestamp: timestamp,
      messageImage: messagePostImage,
      messageImageName,
      messageImageType,
    };

    firebase
      .database()
      .ref(`messages/${UserMessageId}/${uid}`)
      .push(ChatMessages, function (error) {
        if (error) {
          alert(error);
        } else {
          firebase
            .database()
            .ref("fcmToken")
            .child(UserMessageId)
            .once("value")
            .then(function (data) {
              $.ajax({
                url: "https://fcm.googleapis.com/fcm/send",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `key=${apiKey}`,
                },
                notification: {
                  to: data.val().token_id,
                },
                data: JSON.stringify({
                  to: data.val().token_id,
                  data: {
                    message: ChatMessages.postMessage.substring(0, 30) + "....",
                    userName: currentUserImage.username,
                    // sound: default,
                    // icon: currentUserImage.photoUrl,
                  },
                }),
                success: function (response) {
                  console.log("success", response);
                },
                error: function (error) {
                  console.log("error", error.message);
                },
              });
            });
        }
      });
    dispatch(sendMessages(ChatMessages));
    clearFields();
    document.getElementById("textmessage").focus();
  };

  return (
    <div>
      <Dialog
        classes={{ paper: "message-dailog" }}
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

        <DialogContent classes={{ root: "chat-root" }}>
          <DialogContentText>
            <div>
              {/* {error ? <p className="text-danger">{error}</p> : null}  */}
              {allMessages != null && Object.keys(allMessages).length > 0
                ? Object.keys(allMessages).map((key) => {
                    let postMessage = allMessages[key].postMessage;
                    let messageImage = allMessages[key].messageImage;
                    let UserId = allMessages[key].MessageFrom;
                    let messageImageType = allMessages[key].messageImageType;
                    let messageto = allMessages[key].MessagetoId;
                    return (
                      <div key={key}>
                        <>
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
                                handleDeleteMessage(
                                  key,
                                  allMessages[key].messageImageName &&
                                    allMessages[key].messageImageName
                                );
                              }}
                            >
                              <DeleteOutlineIcon
                                classes={{ root: "svg-icon" }}
                              />
                              Delete Message
                            </IconButton>
                            {allMessages[key].timestamp}
                          </div>
                        </>
                      </div>
                    );
                  })
                : ""}
              {
                <>
                  {recieverMessages !== null &&
                    Object.keys(recieverMessages).map((key) => {
                      let postMessage = recieverMessages[key].postMessage;
                      let messageImage = recieverMessages[key].messageImage;
                      let UserId = recieverMessages[key].MessageFrom;
                      let messageImageType =
                        recieverMessages[key].messageImageType;
                      let messageto = recieverMessages[key].MessagetoId;
                      return (
                        <div key={key}>
                          <>
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
                                  handleDeleteRecieverMessage(
                                    key,
                                    recieverMessages[key].messageImageName &&
                                      recieverMessages[key].messageImageName
                                  );
                                }}
                              >
                                <DeleteOutlineIcon
                                  classes={{ root: "svg-icon" }}
                                />
                                Delete Message
                              </IconButton>
                              {recieverMessages[key].timestamp}
                            </div>
                          </>
                        </div>
                      );
                    })}
                </>
              }
            </div>
          </DialogContentText>
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

          <input
            id="textmessage"
            type="text"
            placeholder="Type Here..."
            className="form-control chat-input"
            onKeyDown={onKeyDown}
            onChange={(e) => {
              setPostMessage(e.target.value);
            }}
            value={postMessage}
          ></input>
          <div>
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
