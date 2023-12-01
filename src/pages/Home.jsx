import { useEffect, useState } from "react";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

import { GetData } from "../utils/api";
import { setPosts } from "../store/authSlice";

import { useDispatch, useSelector } from "react-redux";

import UserCard from "../components/UserCard";
import PostsCard from "../components/PostsCard";
import Navbar from "../components/NavBar";
import MyPostCard from "../components/MyPostCard";
import SuggestionCard from "../components/SuggestionCard";
import { ThreeDotsLoader } from "../components/Loader";

const Home = () => {
  const dispatch = useDispatch();
  const { user, token, posts } = useSelector((state) => state.auth);

  const [show, setShow] = useState("hide");
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const getFeedPost = async () => {
    const res = await GetData(`feedPosts?pageNum=${pageNum}`, token);
    dispatch(setPosts(res));
  };

  const nextPageData = async () => {
    const nextPageNum = pageNum + 1;
    setLoading(true);
    const res = await GetData(`feedPosts?pageNum=${nextPageNum}`, token);
    if (res.length) {
      dispatch(setPosts([...posts, ...res]));
      setLoading(false);
      setPageNum(nextPageNum);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedPost();
    setPageNum(1);
  }, []);

  const scrollHandle = () => {
    if (window.scrollY > 900) {
      setShow("show");
    } else {
      setShow("hide");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandle);
    return () => window.removeEventListener("scroll", scrollHandle);
  }, []);

  return (
    <>
      <Navbar />
      <div className="home mt-5 w-full h-full  items-start flex justify-center ">
        <div className="flex justify-between relative  md:items-start max-w-[465px] md:max-w-full w-full  md:flex-row flex-col gap-2">
          <div className=" dark:bg-darkGray    border-2 dark:border-none rounded-md p-3 basis-[40%] lg:basis-[30%]">
            <UserCard data={user} />
          </div>
          <div className=" myPost flex flex-col h-screen md:overflow-scroll  gap-2 basis-[60%] lg:basis-[42%]">
            <div className="dark:bg-darkGray  border-2 dark:border-none p-3 rounded-md">
              <MyPostCard getFeedPost={getFeedPost} data={user} />
            </div>
            <div className="">
              {posts?.map((item) => (
                <PostsCard getFeedPost={getFeedPost} key={item?._id} data={item} />
              ))}
              {!loading ? (
                <>
                  {posts?.length >= 50 ? (
                    <button className="my-4 cursor-pointer" onClick={nextPageData}>
                      Load More
                    </button>
                  ) : (
                    <p className="text-center my-3">No More Post Available.</p>
                  )}
                </>
              ) : (
                <div className="text-center my-5">
                  <ThreeDotsLoader />
                </div>
              )}
            </div>
          </div>
          <div className="dark:bg-darkGray  border-2 dark:border-none  lg:block  p-3 rounded-md hidden  basis-[28%]">
            <SuggestionCard />
          </div>

          {show === "show" && (
            <div
              onClick={() => window.scrollTo(0, 0)}
              className=" fixed text-2xl bottom-[10%] right-[5%] cursor-pointer"
            >
              <BsFillArrowUpCircleFill />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
