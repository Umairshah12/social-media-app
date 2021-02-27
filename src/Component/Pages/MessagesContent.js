import React, { useEffect, useState } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import firebase from "../Services/firebase";
import CardMedia from "@material-ui/core/CardMedia";
import List from "@material-ui/core/List";

function MessagesContent(props) {
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref(`users/${props.id}`)
      .on("value", function (snapshot) {
        let snapValue = snapshot.val();
        setImage(snapValue.photoUrl);
        setUserName(snapValue.username);
      });
  }, []);

  let uid = firebase.auth().currentUser.uid;
  return (
    <div>
      <List>
        <CardHeader
          className="card-header-pic"
          className={`${
            props.id === uid ? "card-header-pic " : "card-header-user-recievers"
          }`}
          avatar={
            <Avatar
              classes={{
                circular: "comment-circle",
              }}
              alt="User Icon"
              src={image}
            />
          }
          classes={{
            content: `${
              props.id === uid ? "current-user-message" : "comment-section"
            }`,
            title: "comment-title",
            subheader: "comment-subheader",
            // root: "card-header-pic",
          }}
          title={userName}
          subheader={
            props.postMessage !== "" ? (
              <div>{props.postMessage}</div>
            ) : props.messageImageType === "video/mp4" ? (
              <div>
                <CardMedia
                  component="video"
                  image={props.messageImage}
                  title="title"
                  className="message-image"
                  controls
                  // autoPlay
                />
              </div>
            ) : (
              <div>
                <img
                  src={props.messageImage && props.messageImage}
                  alt="media app"
                  className="message-image"
                />
              </div>
            )
          }
        />
      </List>
    </div>
  );
}

export default MessagesContent;
