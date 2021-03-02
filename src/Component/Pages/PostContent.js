import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import firebase from "../Services/firebase";

function PostContent(props) {
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref(`users/${props.postid}`)
      .on("value", function (snapshot) {
        let snapValue = snapshot.val();
        setImage(snapValue.photoUrl);
        setUserName(snapValue.username);
      });
  }, [props.postid]);

  return (
    <div>
      <CardHeader
        className="card-header"
        avatar={<Avatar alt="User Icon" src={image} />}
        title={userName}
        subheader={props.timestamp}
      />
    </div>
  );
}

export default PostContent;
