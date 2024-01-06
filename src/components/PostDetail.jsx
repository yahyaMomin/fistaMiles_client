/* eslint-disable react/prop-types */
import { useState } from 'react'
import BaseLine from '../extra/BaseLine'
import { useNavigate } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { PatchData, deleteData } from '../utils/api'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { RiSendPlaneFill } from 'react-icons/ri'
import { ThreeDotsLoader } from '../extra/Loader'

const PostDetail = ({ data, user, token, getFeedPost }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')

  const [showDesc, setShowDesc] = useState(false)
  const [id, setId] = useState('')
  const [showToggle, setShowToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [desc, setDesc] = useState('')

  const deletePost = async (id) => {
    setLoading(true)
    setShowToggle(!showToggle)
    const res = await deleteData(`deletePost/${id}`, token)
    setLoading(false)
    getFeedPost()

    alert(res.msg)
  }

  const changeDesc = async (e, postId) => {
    setLoading(true)
    e.preventDefault()
    const formData = {
      postId,
      description: desc,
    }
    await PatchData('updateDescription', formData, token)
    setDesc('')
    setShowDesc(false)
    setLoading(false)
    getFeedPost()
  }

  return (
    <>
      {!loading ? (
        <div>
          <div className="flex justify-between items-center">
            <div className="user flex  gap-2 justify-start items-center">
              <div className="image h-12 w-12 ">
                <img
                  className="h-full w-full object-cover rounded-full"
                  // eslint-disable-next-line react/prop-types
                  src={data?.postedBy?.avatar}
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
                  <small
                    className="cursor-pointer"
                    onClick={() => {
                      setShowToggle(!showToggle)
                      setId(data?._id)
                    }}
                  >
                    <BsThreeDots />
                  </small>
                )}
                {showToggle && id === data?._id && (
                  <ul className="absolute top-[50%] right-[100%] z-50 py-1  dark:bg-black  bg-lightWhite text-center  w-20 rounded-md ">
                    <li
                      onClick={() => {
                        setShowDesc(!showDesc)
                        setShowToggle(!showToggle)
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
        </div>
      ) : (
        <ThreeDotsLoader />
      )}
    </>
  )
}

export default PostDetail
