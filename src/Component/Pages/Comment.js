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
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import CardHeader from "@material-ui/core/CardHeader";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import { Fab } from "@material-ui/core";
import { storage } from "../Services/firebase";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  makeNewPost,
  closeCommentDailog,
  RemoveComment,
  FailureError,
} from "../Redux/Actions/UserAction";

function Comment(props) {
  const [postComment, setPostComment] = useState("");
  const [commentFile, setCommentFile] = useState("");
  const [commentImageName, setCommentImageName] = useState("");
  const [commentImageType, setCommentImageType] = useState("");
  const [commentPostImage, setCommentPostImage] = useState("");
  const dispatch = useDispatch();
  const open = useSelector((state) => state.UserReducer.commentDailog);
  const close = useSelector((state) => state.UserReducer.commentDailog);
  const postCommentId = useSelector((state) => state.UserReducer.commentId);
  const error = useSelector((state) => state.UserReducer.error);

  const comments = useSelector(
    (state) => state.UserReducer.postSpecificComments
  );
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  const handleUploadCommentImage = (event) => {
    let file = event.target.files[0];
    setCommentFile(file);
    setCommentImageName(file.name);
    setCommentImageType(file.type);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentPostImage(reader.result);
    };
  };

  const handleDeleteComment = async (key, data) => {
    try {
      let Result = await firebase
        .database()
        .ref(`posts/${postCommentId}/comments/${key}`)
        .remove();
      Result = await firebase.storage().ref(`commentImages/${data}`).delete();
      setCommentImageName("");
      return dispatch(RemoveComment(Result));
    } catch (error) {
      dispatch(FailureError(error.message));
    }
  };

  const uploadImage = () => {
    const uploadTask = storage
      .ref(`commentImages/${commentFile.name}`)
      .put(commentFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("commentImages")
          .child(commentFile.name)
          .getDownloadURL()
          .then((url) => {
            // setImageUrl(url);
          });
      }
    );
  };

  const clearFields = () => {
    setPostComment("");
    setCommentImageName("");
    setCommentImageType("");
    setCommentPostImage("");
  };

  let timestamp = moment().format("h:mm a");

  const makeComment = (e, postCommentId) => {
    e.preventDefault();
    if (commentFile) {
      uploadImage();
    }
    let makePost = firebase.database().ref(`posts/${postCommentId}/comments`);
    makePost.push({
      id: currentUser.id,
      postComment: postComment,
      pic: currentUser.photoUrl,
      timestamp: timestamp,
      commentImage: commentPostImage,
      userName: currentUser.username,
      commentImageName,
      commentImageType,
    });
    dispatch(makeNewPost(makePost));
    clearFields();
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
            <div>
              {/* {error ? <p className="text-danger">{error}</p> : null} */}
              {comments != null && Object.keys(comments).length > 0
                ? Object.keys(comments).map((key) => {
                    return (
                      <div key={key}>
                        <CardHeader
                          avatar={
                            <Avatar
                              classes={{
                                circular: "comment-circle",
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
                          subheader={
                            comments[key].postComment === "" ? (
                              <img
                                src={
                                  comments[key].commentImage &&
                                  comments[key].commentImage
                                }
                                alt="media app"
                                className="comment-image"
                              />
                            ) : (
                              comments[key].postComment
                            )
                          }
                        />
                        <div className="commment-post-time">
                          <IconButton
                            className="comment-btn"
                            aria-label="message"
                            onClick={() => {
                              handleDeleteComment(
                                key,
                                comments[key].commentImageName &&
                                  comments[key].commentImageName
                              );
                            }}
                          >
                            <DeleteOutlineIcon classes={{ root: "svg-icon" }} />
                            Delete comment
                          </IconButton>
                          {comments[key].timestamp}
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
              setPostComment(e.target.value);
            }}
            label="Leave Comment"
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
              onChange={handleUploadCommentImage}
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
                dispatch(closeCommentDailog());
              }}
              color="secondary"
              className="action-cancel"
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
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Comment;
