import UserCard from '../cards/UserCard'
import NavBar from '../components/NavBar'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import { useParams, useLocation } from 'react-router-dom'
import { GetData } from '../utils/api'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ThreeDotsLoader } from '../extra/Loader'
import PostsCard from '../cards/PostsCard'
import SuggestionCard from '../cards/SuggestionCard'

const Profile = () => {
  const [data, setData] = useState(null)
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  const { id } = useParams()

  const { token } = useSelector((state) => state.auth)

  const [show, setShow] = useState('hide')
  const [pageNum, setPageNum] = useState(1)

  const getUser = async () => {
    const res = await GetData(`getUser/${id}`, token)
    setData(res.user)
  }
  const getUserPosts = async () => {
    setLoading(true)
    const res = await GetData(`posts/${id}`, token)
    setPosts(res.posts)
    setLoading(false)
  }
  useEffect(() => {
    getUser()
    getUserPosts()
  }, [id])

  const nextPageData = async () => {
    const nextPageNum = pageNum + 1
    setLoading(true)
    const res = await GetData(`posts/${id}?page=${nextPageNum}`, token)
    if (res.length) {
      setPosts([...posts, ...res.posts])
      setLoading(false)
      setPageNum(nextPageNum)
    } else {
      setLoading(false)
    }
  }

  const scrollHandle = () => {
    if (window.scrollY > 900) {
      setShow('show')
    } else {
      setShow('hide')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollHandle)
    return () => window.removeEventListener('scroll', scrollHandle)
  }, [])

  return (
    <>
      <NavBar />
      <div className="home mt-5 w-full h-full  items-start flex justify-center ">
        <div className="flex justify-between relative  md:items-start max-w-[465px] md:max-w-full w-full  md:flex-row flex-col gap-2">
          <div className=" dark:bg-darkGray  flex-wrap   border-2 dark:border-none rounded-md p-3 basis-[40%] lg:basis-[30%]">
            <UserCard getUser={getUser} data={data} isProfile={true} />
          </div>
          <div className=" myPost flex flex-col h-screen md:overflow-scroll  gap-2 basis-[60%] lg:basis-[42%]">
            {posts && <PostsCard getFeedPost={getUserPosts} data={posts} />}
            {!loading ? (
              <>
                {posts?.length >= 50 ? (
                  <button className="my-4 cursor-pointer" onClick={nextPageData}>
                    Load More
                  </button>
                ) : (
                  <p className="text-center my-3">No More Post Available</p>
                )}
              </>
            ) : (
              <div className="text-center my-5">
                <ThreeDotsLoader />
              </div>
            )}
          </div>
          <div className="dark:bg-darkGray  border-2 dark:border-none  lg:block  p-3 rounded-md hidden  basis-[28%]">
            <SuggestionCard />
          </div>

          {show === 'show' && (
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
  )
}

export default Profile
