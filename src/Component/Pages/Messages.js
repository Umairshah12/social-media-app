import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import firebase from "../Services/firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";

import {
  closeMessagesDailog,
  sendMessages,
  RemoveMessage,
} from "../Redux/Actions/MessagesAction";
import { FailureError } from "../Redux/Actions/UserAction";

function Messages(props) {
  console.log("chat key props", props.chatKey);
  const [postMessage, setPostMessage] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [messageImageName, setMessageImageName] = useState("");
  const [messageImageType, setMessageImageType] = useState("");
  const [messagePostImage, setMessagePostImage] = useState("");

  const dispatch = useDispatch();
  const currentUserImage = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  const open = useSelector((state) => state.MessagesReducer.MessagesDailog);
  const UserMessageId = useSelector(
    (state) => state.MessagesReducer.UserMessageId
  );
  const ChatKey = useSelector((state) => state.MessagesReducer.UserChatKey);

  let apiKey =
    "AAAAZPe9IZ0:APA91bE1IJq_ohIsKv0KvhEi5JwVBnx8FjKMKtUeJlKhABx4LTDL0WKxNYcH21kN79j03_obyk7dHLSDTV0TL4OkZCbKKpDPiQj5GVnXPNxopQYHIfvN8Ol1jRTcJNChplCc3SFZPDwl";

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

  const handleDeleteRecieverMessage = async (key, data) => {
    try {
      let Result = await firebase
        .database()
        .ref(`Chat-Messages/${ChatKey}/${key}`)
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

  const onKeyDown = (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      sendMessage();
    }
  };

  const sendMessage = (e) => {
    if (postMessage === "" && messagePostImage === "") {
      e.preventDefault();
    } else {
      if (messageFile) {
        uploadImage();
      }

      let ChatMessages = {
        uid: uid,
        postMessage: postMessage,
        timestamp: timestamp,
        messageImage: messagePostImage,
        messageImageName,
        messageImageType,
      };

      firebase
        .database()
        .ref(`Chat-Messages/${ChatKey}`)
        .push(ChatMessages, function (error) {
          if (error) {
            alert(error);
          } else {
            firebase
              .database()
              .ref(`fcmToken/${UserMessageId}`)
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
                      message:
                        ChatMessages.postMessage.substring(0, 30) + "....",
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
    }
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

            <IconButton
              className="close-icon"
              onClick={() => {
                dispatch(closeMessagesDailog());
              }}
            >
              <CloseIcon className="close-icon" />
            </IconButton>
          </ListItem>
        </DialogTitle>

        <DialogContent classes={{ root: "chat-root" }}>
          <DialogContentText>
            {recieverMessages != null &&
            Object.keys(recieverMessages).length > 0 ? (
              Object.keys(recieverMessages).map((key) => {
                console.log("reciever messages", recieverMessages[key]);
                let postMessage = recieverMessages[key].postMessage;
                let messageImage = recieverMessages[key].messageImage;
                let UserId = recieverMessages[key].uid;
                let messageImageType = recieverMessages[key].messageImageType;

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
                          if (
                            window.confirm(
                              "Are you sure you wish to delete this Message?"
                            )
                          )
                            handleDeleteRecieverMessage(
                              key,
                              recieverMessages[key].messageImageName &&
                                recieverMessages[key].messageImageName
                            );
                        }}
                      >
                        <DeleteOutlineIcon classes={{ root: "svg-icon" }} />
                        Delete Message
                      </IconButton>
                      {recieverMessages[key].timestamp}
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="chat-message">
                  <ChatIcon className="post-style" />
                </div>
                <p className="chat-message">Chat Empty</p>
              </>
            )}
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
          />
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
