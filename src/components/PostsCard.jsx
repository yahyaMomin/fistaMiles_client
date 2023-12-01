import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import BaseLine from "./BaseLine";
import { LoaderSpinner, ThreeDotsLoader } from "./Loader";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillShareFill, BsThreeDots } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa6";
import { useState } from "react";
import { GetData, PatchData, deleteData, postData } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RiSendPlaneFill } from "react-icons/ri";
import millify from "millify";
import { setUser, updatePosts } from "../store/authSlice";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";

const PostsCard = ({ getFeedPost, data }) => {
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [showAni, setShowAni] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(null);
  const [showToggle, setShowToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("newest");
  const [desc, setDesc] = useState("");
  const [showDesc, setShowDesc] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);

  const tabChange = (tab) => {
    setActiveTab(tab);
    getComments();
  };

  TimeAgo.addLocale(en);

  // get comments
  const getComments = async (e) => {
    if (e) setShowComment(!showComment);
    const res = await GetData(`comments/${data?._id}?sortBy=${activeTab}`, token);
    setComments(res.comments);
  };

  // create comments
  const createComment = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      postId: id,
      comment,
    };
    const res = await postData("createComment", formData, token);
    setComments(res.comments);
    setLoading(false);
    setComment(null);
  };

  // patch Like
  const patchLike = async (id) => {
    setShowAni(true);
    const formData = {
      postId: id,
    };
    const res = await PatchData("likeUnlike", formData, token);
    dispatch(updatePosts(res.post));
    setShowAni(false);
    getFeedPost();
  };

  const changeDesc = async (e, postId) => {
    e.preventDefault();
    const formData = {
      postId,
      description: desc,
    };
    await PatchData("updateDescription", formData, token);
    setDesc("");
    setShowDesc(false);
    getFeedPost();
  };

  const deletePost = async (id) => {
    setLoading2(true);
    setShowToggle(!showToggle);
    const res = await deleteData(`deletePost/${id}`, token);
    setLoading2(false);
    getFeedPost();
    dispatch(setUser(res.user));
    alert(res.msg);
  };

  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      {data ? (
        <>
          {!loading2 ? (
            <>
              <div className=" mb-2 dark:bg-darkGray border-2 dark:border-none p-3 rounded-md ">
                <div className="flex justify-between items-center">
                  <div className="user flex  gap-2 justify-start items-center">
                    <div className="image h-12 w-12 ">
                      <img
                        className="h-full w-full object-cover rounded-full"
                        // eslint-disable-next-line react/prop-types
                        src={`${import.meta.env.VITE_APP_USER_URL}/${data?.postedBy?.avatar}`}
                        alt="user Image"
                      />
                    </div>
                    <div className="userName opacity-[.7]">
                      <p onClick={() => navigate(`/profile/${data?.postedBy._id}`)} className="text-sm cursor-pointer">
                        {data?.postedBy?.userName}
                      </p>
                      <p className="opacity-[.6] text-xs">{data?.postedBy?.location}</p>
                    </div>
                  </div>

                  <div className="time opacity-[.7] flex justify-center gap-2 items-end flex-col">
                    <div className="ul relative">
                      {data?.postedBy._id === user._id && (
                        <small className="cursor-pointer" onClick={() => setShowToggle(!showToggle)}>
                          <BsThreeDots />
                        </small>
                      )}
                      {showToggle && (
                        <ul className="absolute top-[50%] right-[100%] z-50 py-1  dark:bg-black  bg-lightWhite text-center  w-20 rounded-md ">
                          <li
                            onClick={() => {
                              setShowDesc(!showDesc);
                              setShowToggle(!showToggle);
                            }}
                            className="hover:dark:bg-white hover:bg-[#cbcdd1] py-1 hover:text-black cursor-pointer "
                          >
                            edit
                          </li>
                          <li
                            onClick={() => deletePost(data?._id)}
                            className="hover:dark:bg-white hover:bg-[#cbcdd1] py-1 hover:text-black cursor-pointer"
                          >
                            Delete
                          </li>
                        </ul>
                      )}
                    </div>
                    <p className="text-xs">{timeAgo.format(new Date(data?.createdAt))}</p>
                  </div>
                </div>
                {showDesc && (
                  <form className="w-full relative my-3" onSubmit={(e) => changeDesc(e, data?._id)}>
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full px-2 border-b bg-transparent dark:text-white dark:border-lightWhite"
                      placeholder="enter Your New Description"
                    />
                    {desc && (
                      <button type="submit" className="absolute top-[50%] translate-y-[-50%] right-1 text-xl">
                        <RiSendPlaneFill />
                      </button>
                    )}
                  </form>
                )}
                <div className="des mt-5 mb-[-10px] text-sm opacity-[.7]">{data?.description}</div>
                <BaseLine />
                <div className="image">
                  <div className="pre flex justify-center items-center">
                    <div className="w-full relative  max-w-[465px]  ">
                      <img
                        onDoubleClick={() => patchLike(data?._id)}
                        className=" max-h-[480px]  h-full w-full  rounded-md"
                        src={`${import.meta.env.VITE_APP_POST_URL}/${data?.image}`}
                      />
                      {showAni && (
                        <div className="animation  absolute top-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
                          <AiFillHeart size={30} className="text-main" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <BaseLine />
                <div className="info text-base flex justify-between opacity-[.8] items-center px-5">
                  <div
                    onClick={() => {
                      patchLike(data?._id);
                    }}
                    className="like text-xl flex justify-end items-center gap-1 cursor-pointer "
                  >
                    {data?.likes.includes(user._id) ? <AiFillHeart className="text-main" /> : <AiOutlineHeart />}
                    <small className="text-xs">{data?.likes?.length < 1 ? "" : millify(data?.likes.length)}</small>
                  </div>
                  <div className="comment flex justify-center items-center gap-1 cursor-pointer">
                    <FaCommentDots onClick={() => getComments("btn")} />
                    <small className="text-xs">
                      {data?.comments?.length < 1 ? "0" : millify(data?.comments.length)}
                    </small>
                  </div>
                  <div className="share cursor-pointer">
                    <BsFillShareFill onClick={() => alert("share feature isn't implemented to this project")} />
                  </div>
                </div>
                {showComment && (
                  <div className="comments">
                    <BaseLine />
                    {!loading ? (
                      <div className="create flex justify-between mb-5 items-center gap-4">
                        <div className="userImage w-8 h-8">
                          <img
                            className="h-full w-full object-cover rounded-full"
                            src={`${import.meta.env.VITE_APP_USER_URL}/${data?.postedBy?.avatar}`}
                            alt=""
                          />
                        </div>

                        {/* make comment */}

                        <form className="flex w-full  relative" onSubmit={(e) => createComment(e, data?._id)}>
                          <input
                            id="comment"
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-transparent px-2 border-b dark:border-b-lightWhite w-full dark:text-white py-2 text-sm"
                            placeholder="write your comment here..."
                            type="text"
                          />
                          {comment && (
                            <button
                              className="absolute right-0 text-2xl cursor-pointer hover:opacity-[1] opacity-[.7]"
                              type="submit"
                            >
                              <RiSendPlaneFill />
                            </button>
                          )}
                        </form>
                      </div>
                    ) : (
                      <div className="text-center flex justify-center items-center">
                        <ThreeDotsLoader />
                      </div>
                    )}
                    <div className="box flex my-3 gap-3">
                      <p
                        className={` tab ${activeTab === "top" ? "active" : undefined} bg-[#454443] ${
                          activeTab === "top"
                            ? "bg-darkGray dark:bg-white text-white dark:text-black"
                            : "dark:bg-[#454443] bg-lightWhite"
                        } py-[2px]   px-3 rounded-md cursor-pointer`}
                        onClick={() => tabChange("top")}
                      >
                        top
                      </p>
                      <p
                        className={` tab ${activeTab === "newest" ? "active" : undefined} bg-[#454443] ${
                          activeTab === "newest"
                            ? "bg-darkGray dark:bg-white text-white  dark:text-black"
                            : "dark:bg-[#454443] bg-lightWhite"
                        } py-1     px-3 rounded-md cursor-pointer`}
                        onClick={() => tabChange("newest")}
                      >
                        newest
                      </p>
                      <p
                        className={` tab ${activeTab === "oldest" ? "active" : undefined} bg-[#454443] ${
                          activeTab === "oldest"
                            ? "bg-darkGray dark:bg-white text-white dark:text-black"
                            : "dark:bg-[#454443] bg-lightWhite"
                        } py-1   px-3 rounded-md cursor-pointer`}
                        onClick={() => tabChange("oldest")}
                      >
                        oldest
                      </p>
                    </div>
                    <Comments getComments={getComments} item={comments} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <LoaderSpinner />
          )}
        </>
      ) : (
        <ThreeDotsLoader />
      )}
    </>
  );
};

export default PostsCard;
