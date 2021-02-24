import React, { useEffect, useState } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import firebase from "../Services/firebase";
import CardMedia from "@material-ui/core/CardMedia";

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

  return (
    <div>
      <CardHeader
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
          content: "comment-section",
          title: "comment-title",
          subheader: "comment-subheader",
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
    </div>
  );
}

export default MessagesContent;
