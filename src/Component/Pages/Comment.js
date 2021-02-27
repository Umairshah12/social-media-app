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

  const onKeyDown = (event, postCommentId) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      makeComment(event, postCommentId);
    }
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
      timestamp: timestamp,
      commentImage: commentPostImage,
      commentImageName,
      commentImageType,
    });

    dispatch(makeNewPost(makePost));
    clearFields();
    document.getElementById("textcomment").focus();
  };

  return (
    <div>
      <Dialog
        classes={{ paper: "message-dailog" }}
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
                    let postComment = comments[key].postComment;
                    let commentImage = comments[key].commentImage;
                    let id = comments[key].id;
                    return (
                      <div key={key}>
                        <CommentContent
                          postComment={postComment}
                          id={id}
                          commentImage={commentImage}
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
          <input
            id="textcomment"
            type="text"
            placeholder="Type Here..."
            className="form-control chat-input"
            onChange={(e) => {
              setPostComment(e.target.value);
            }}
            value={postComment}
            onKeyDown={(e) => {
              return postComment === "" && commentPostImage === ""
                ? ""
                : onKeyDown(e, postCommentId);
            }}
          ></input>
          <div>
            <Button
              variant="contained"
              onClick={(e) => {
                return postComment === "" && commentPostImage === ""
                  ? ""
                  : makeComment(e, postCommentId);
              }}
              color="primary"
            >
              Post
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Comment;
