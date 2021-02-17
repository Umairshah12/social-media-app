import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import firebase from "../Services/firebase";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { makeNewPost, closeCommentDailog } from "../Redux/Actions/UserAction";

function Comment(props) {
  const [postComment, setPostComment] = useState("");
  const dispatch = useDispatch();
  const open = useSelector((state) => state.UserReducer.commentDailog);
  const close = useSelector((state) => state.UserReducer.commentDailog);
  const postCommentId = useSelector((state) => state.UserReducer.commentId);

  const comments = useSelector(
    (state) => state.UserReducer.postSpecificComments
  );
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  let timestamp = moment().format("h:mm a");
  const makeComment = (e, postCommentId) => {
    e.preventDefault();
    let makePost = firebase.database().ref(`posts/${postCommentId}/comments`);
    makePost.push({
      id: currentUser.id,
      postComment: postComment,
      pic: currentUser.photoUrl,
      timestamp: timestamp,
      userName: currentUser.username,
    });
    dispatch(makeNewPost(makePost));
    setPostComment("");
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        onClose={() => {
          dispatch(closeCommentDailog());
        }}
        aria-labelledby="form-dialog-title"
        open={open}
      >
        <DialogTitle className="comment-header" id="form-dialog-title">
          Comments
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              {comments != null && Object.keys(comments).length > 0
                ? Object.keys(comments).map((key) => {
                    return (
                      <div key={key}>
                        <CardHeader
                          avatar={
                            <Avatar
                              classes={{
                                circle: "comment-circle",
                              }}
                              alt="User Icon"
                              src={comments[key].pic}
                            />
                          }
                          classes={{
                            content: "comment-section",
                            title: "comment-title",
                            subheader: "comment-subheader",
                          }}
                          title={comments[key].userName}
                          subheader={comments[key].postComment}
                        />
                        <div className="commment-post-time">
                          {comments[key].timestamp}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </List>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => {
              setPostComment(e.target.value);
            }}
            label="Leave Comment"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(closeCommentDailog());
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              makeComment(e, postCommentId);
            }}
            color="primary"
          >
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Comment;