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
import Box from "@material-ui/core/Box";
import { red } from "@material-ui/core/colors";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import facebook from "../assets/audio/facebook_messenger.mp3";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../Services/firebase";
import {
  fetchAllPosts,
  RemovePost,
  FailureError,
  makeNewPost,
} from "../Redux/Actions/UserAction";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
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
  const [likes, setLikes] = useState(0);
  const [makeLike, setMakeLike] = useState(false);
  const [fbsound, setFbSound] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const allposts = useSelector((state) => state.UserReducer.fetchPosts);
  const error = useSelector((state) => state.UserReducer.error);
  const currentUser = useSelector(
    (state) => state.UserReducer.currentfetchedUser
  );

  let audio = new Audio(facebook);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = async (key, data) => {
    try {
      let Remove_Post = await firebase.database().ref();
      let Result = await Remove_Post.child(`posts/${key}`).remove();
      Result = await firebase.storage().ref(`postImages/${data}`).delete();
      dispatch(RemovePost(Result));
    } catch (error) {
      dispatch(FailureError(error.message));
    }
  };

  const LikePost = (key) => {
    setFbSound(true);
    let postLikes = firebase
      .database()
      .ref(`posts/${key}/likePost/${currentUser.id}`);
    postLikes.update({
      id: currentUser.id,
      likePost: likes + 1,
      makeLike: true,
    });
    dispatch(makeNewPost(postLikes));
  };

  const DisLikePost = (key) => {
    setFbSound(false);
    let postLikes = firebase
      .database()
      .ref(`posts/${key}/likePost/${currentUser.id}`)
      .remove();
    setMakeLike(false);
    dispatch(makeNewPost(postLikes));
  };

  const handleClickLikes = (key) => {
    setFbSound(!fbsound);

    if (fbsound === false) {
      audio.play();
    } else {
      console.log("sound effect closed");
    }

    setMakeLike(!makeLike);
    if (makeLike === false) {
      LikePost(key);
    } else {
      DisLikePost(key);
    }
  };

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
      {error ? <p className="text-danger">{error}</p> : null}
      {allposts != null && Object.keys(allposts).length > 0 ? (
        Object.keys(allposts).map((key) => {
          let allLikes = allposts[key].likePost;

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
                  <CardContent
                    className="card-content"
                    style={{
                      background: allposts[key].colorPicker1
                        ? allposts[key].colorPicker1
                        : "#bbbb",
                    }}
                  >
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
                {allposts[key].filetype !== "" &&
                allposts[key].postPic !== "" ? (
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold" m={1}>
                      {allposts[key].post}
                    </Box>
                  </Typography>
                ) : (
                  ""
                )}
              </CardContent>
              <CardActions className="like-comment-section" disableSpacing>
                {allLikes != null && Object.keys(allLikes).length > 0 ? (
                  <>
                    <IconButton aria-label="likes">
                      <ThumbUpAltIcon className="total-likes" />
                      {Object.keys(allLikes).length === 0 ? (
                        ""
                      ) : (
                        <div className="countNumber">
                          {Object.keys(allLikes).length}
                        </div>
                      )}
                    </IconButton>
                  </>
                ) : (
                  ""
                )}
                <IconButton aria-label="message">
                  <div className="countNumber">2</div>
                  <span className="comment">Comments</span>
                </IconButton>
              </CardActions>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <ThumbUpAltIcon
                    onClick={() => {
                      handleClickLikes(key);
                    }}
                  />
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
                    handleClick(key, allposts[key].imageName);
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
