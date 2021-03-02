import React, { useEffect, useState } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import firebase from "../Services/firebase";

function CommentContent(props) {
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
  }, [props.id]);

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
          props.postComment === "" ? (
            <img
              src={props.commentImage && props.commentImage}
              alt="media app"
              className="comment-image"
            />
          ) : (
            props.postComment
          )
        }
      />
    </div>
  );
}

export default CommentContent;
