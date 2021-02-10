import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../Services/firebase";
import {
  fetchAllPosts,
  RemovePost,
  FailureError,
} from "../Redux/Actions/UserAction";

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 800,
  },
  media: {
    height: 0,
    // paddingTop: "56.25%", // 16:9
    paddingTop: "40%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Content() {
  const [author, setAuthor] = useState();
  const [date, setDate] = useState();
  const [postImage, setPostImage] = useState();
  const [post, setPost] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const allposts = useSelector((state) => state.UserReducer.fetchPosts);
  const error = useSelector((state) => state.UserReducer.error);

  console.log("all posts", allposts);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = async (key) => {
    try {
      let Remove_Post = await firebase.database().ref();
      let Result = await Remove_Post.child(`posts/${key}`).remove();
      dispatch(RemovePost(Result));
    } catch (error) {
      dispatch(FailureError(error.message));
    }
  };
  // const handleClick = (key) => {
  //   let Remove_Post = firebase.database().ref("posts");
  //   let Result = Remove_Post.child(key).remove();
  //   dispatch(RemovePost(Result));
  // };

  useEffect(() => {
    firebase
      .database()
      .ref(`posts/`)
      .on("value", function (snapshot) {
        let snapValue = snapshot.val();
        return dispatch(fetchAllPosts(snapValue));
      });
  }, []);

  return (
    <div className="card-container">
      <p>{error}</p>
      {allposts != null && Object.keys(allposts).length > 0 ? (
        Object.keys(allposts).map((key) => {
          return (
            <Card className="card-width" key={key}>
              <CardHeader
                avatar={<Avatar alt="User Icon" src={allposts[key].userPic} />}
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={allposts[key].author}
                subheader={allposts[key].timestamp}
              />
              {allposts[key].filetype === "" && allposts[key].postPic === "" ? (
                <>
                  <CardContent className="card-content">
                    <Typography variant="h3" component="h3">
                      {allposts[key].post}
                    </Typography>
                  </CardContent>
                </>
              ) : (
                <>
                  {allposts[key].filetype === "video/mp4" ? (
                    <CardMedia
                      component="video"
                      image={allposts[key].postPic}
                      title="title"
                      controls
                      // autoPlay
                    />
                  ) : (
                    <CardMedia
                      image={allposts[key].postPic}
                      className={classes.media}
                      title="Paella dish"
                    />
                  )}
                </>
              )}

              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {allposts[key].post}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <ThumbUpAltIcon />
                </IconButton>
                <IconButton aria-label="message">
                  <MessageIcon />
                  <span className="comment">Comment</span>
                </IconButton>

                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={(e) => {
                    handleClick(key);
                  }}
                >
                  <DeleteOutlineIcon />
                  <span className="comment">Delete Post</span>
                </IconButton>
              </CardActions>
            </Card>
          );
        })
      ) : (
        <div className="no-post-msg">
          <Typography variant="h4" component="h3">
            NO POSTS AVALIABLE
          </Typography>
        </div>
      )}
    </div>
  );
}
