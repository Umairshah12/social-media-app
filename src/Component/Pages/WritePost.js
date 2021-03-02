import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import firebase from "../Services/firebase";
import { Fab } from "@material-ui/core";
import { storage } from "../Services/firebase";
import { closeDailog, makeNewPost } from "../Redux/Actions/UserAction";
import { useDispatch, useSelector } from "react-redux";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
export default function WritePost() {
  const [post, setPost] = useState("");
  const [postImage, setPostImage] = useState("");
  const [imagefile, setImageFile] = useState("");
  const [filetype, setFileType] = useState("");
  const [imageName, setImageName] = useState("");
  const [colorPicker1, setcolorPicker1] = useState("");

  const dispatch = useDispatch();
  const open = useSelector((state) => state.UserReducer.openDailogData);
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  let timestamp = moment().format("MMMM Do YYYY, h:mm a");

  const handleUpload = (event) => {
    let file = event.target.files[0];
    setImageFile(file);
    setImageName(file.name);
    setFileType(file.type);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setPostImage(reader.result);
    };
  };

  const uploadImage = () => {
    const uploadTask = storage
      .ref(`postImages/${imagefile.name}`)
      .put(imagefile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("postImages")
          .child(imagefile.name)
          .getDownloadURL()
          .then((url) => {
            // setImageUrl(url);
          });
      }
    );
  };

  const clearFields = () => {
    setPost("");
    setPostImage("");
    setImageFile("");
    setFileType("");
    setcolorPicker1("");
  };

  const handlePost = (e) => {
    if (post === "" && postImage === "" && colorPicker1 === "") {
      e.preventDefault();
    } else {
      if (imagefile) {
        uploadImage();
      }

      let postData = {
        uid: currentUser.id,
        post: post,
        timestamp: timestamp,
        postPic: postImage,
        filetype,
        colorPicker1,
        imageName,
      };

      let postsData = firebase.database().ref("posts").push(postData);
      dispatch(makeNewPost(postsData));
      clearFields();
    }
  };

  return (
    <div>
      <Dialog
        classes={{ paper: "message-dailog" }}
        fullWidth={true}
        onClose={() => {
          dispatch(closeDailog());
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          classes={{ root: "post-title" }}
          id="customized-dialog-title"
          onClose={() => {
            dispatch(closeDailog());
          }}
        >
          Create Post
        </DialogTitle>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <TextField
              id="outlined-multiline-static"
              label="Create Post"
              className="text-field-w"
              multiline
              value={post}
              onChange={(e) => {
                setPost(e.target.value);
              }}
              rows={4}
              variant="outlined"
            />
          </form>
        </DialogContent>
        <DialogActions className="dailog-action">
          <div className="gallery-color-input">
            <input
              type="color"
              value={colorPicker1}
              className="bar"
              id="colour"
              onChange={(e) => {
                setcolorPicker1(e.target.value);
              }}
              required
            />
            <input
              accept="video/*,image/*"
              className="image-input"
              required
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUpload}
            />
            <label className="label-size" htmlFor="contained-button-file">
              <Fab component="span">
                <ImageIcon />
              </Fab>
            </label>
          </div>
          <div>
            <Button
              className="action-cancel"
              variant="contained"
              autoFocus
              onClick={() => {
                dispatch(closeDailog());
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              autoFocus
              onClick={handlePost}
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
