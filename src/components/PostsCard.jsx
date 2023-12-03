/* eslint-disable react/prop-types */
import BaseLine from "./BaseLine";
import { LoaderSpinner, ThreeDotsLoader } from "./Loader";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillShareFill } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa6";
import { useState } from "react";
import { GetData, PatchData, postData } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RiSendPlaneFill } from "react-icons/ri";
import millify from "millify";
import { updatePosts } from "../store/authSlice";
import Comments from "./Comments";
import PostDetail from "./PostDetail";
import PostImage from "./postImage";
import LikeAndCommentIcon from "./LikeAndCommentIcon";

const PostsCard = ({ getFeedPost, data }) => {
  const [showAni, setShowAni] = useState(false);
  const [ID, setID] = useState("");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);

  // patch Like
  const patchLike = async (id) => {
    setID(id);
    setShowAni(true);
    const formData = {
      postId: id,
    };
    const res = await PatchData("likeUnlike", formData, token);
    dispatch(updatePosts(res.post));

    setShowAni(false);
    getFeedPost();
  };

  return (
    <>
      {data ? (
        <>
          {data?.map((data) => (
            <div key={data?._id}>
              <>
                <div className=" mb-2 dark:bg-darkGray border-2 dark:border-none p-3 rounded-md ">
                  <PostDetail data={data} user={user} token={token} getFeedPost={getFeedPost} />

                  <PostImage patchLike={patchLike} data={data} showAni={showAni} id={ID} />

                  <LikeAndCommentIcon
                    data={data}
                    user={user}
                    token={token}
                    getFeedPost={getFeedPost}
                    patchLike={patchLike}
                  />
                </div>
              </>
            </div>
          ))}
        </>
      ) : (
        <ThreeDotsLoader />
      )}
    </>
  );
};

export default PostsCard;
