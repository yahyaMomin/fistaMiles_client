/* eslint-disable react/prop-types */
import { useState } from 'react'
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai'
import { RiSendPlaneFill } from 'react-icons/ri'
import { GetData, PatchData, postData } from '../utils/api.js'
import { useSelector } from 'react-redux'
import { ThreeDotsLoader } from '../extra/Loader.jsx'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { deleteData } from '../utils/api.js'

const RepliesCard = ({ item, getComments, ID, post }) => {
  const [showReply, setShowReply] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [repliesData, setRepliesData] = useState([])
  const [replyId, setReplyId] = useState('')
  const [reply, setReply] = useState('')
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.auth)

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')

  const getReplies = async (e) => {
    if (e) setShowReply(!showReply)

    if (e) setLoading2(true)
    const res = await GetData(`getReplies/${item?._id}`, token)
    setRepliesData(res.replies)
    if (e) setLoading2(false)
  }

  const deleteReply = async (replyId) => {
    await deleteData(`deleteReply/${replyId}`, token)
    getReplies()
    getComments('', post._id)
  }

  const sendReply = async (e, commentId) => {
    e.preventDefault()
    setLoading(true)
    const formData = {
      commentId,
      reply,
    }
    await postData('/createReply', formData, token)
    setReply('')
    setLoading(false)
    getComments('', post._id)
    getReplies()
  }

  const patchLike = async (replyId) => {
    const formData = {
      replyId,
    }
    await PatchData(`/likeReply`, formData, token)
    getReplies()
  }

  const editClick = (id) => {
    setReplyId(id)
    setShowDelete(!showDelete)
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex mb-3 items-center gap-5">
          <p>
            <AiOutlineComment onClick={() => getReplies('btn')} className="cursor-pointer text-xl" />
          </p>
          {item?.replies.length ? (
            <p onClick={() => getReplies('btn')} className="text-sm cursor-pointer text-blue-400  dark:text-blue-300">
              replies ({item?.replies.length})
            </p>
          ) : (
            ''
          )}
        </div>
        {showReply && (
          <>
            {!loading ? (
              <form onSubmit={(e) => sendReply(e, item?._id)} className="input w-full mb-4 relative">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full bg-transparent px-2 border-b dark:border-lightWhite border-lightGray  dark:text-white"
                  placeholder="write your reply here..."
                />
                {reply && (
                  <button className="absolute text-xl top-0 right-0 cursor-pointer">
                    <RiSendPlaneFill />
                  </button>
                )}
              </form>
            ) : (
              <ThreeDotsLoader />
            )}
            {repliesData && (
              <>
                {!loading2 ? (
                  <div className="replies">
                    {repliesData?.map((item) => (
                      <div className="mb-5" key={item?._id}>
                        <div className="flex w-full  items-center gap-2">
                          <div className="image self-start h-8 w-8">
                            <img
                              className="w-full h-full object-cover rounded-full"
                              src={item?.replyBy?.avatar}
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col ">
                            <div className="flex w-full items-center gap-2 justify-between">
                              <p
                                className={`text-xs mb-1 hover:opacity-[1] cursor-pointer opacity-[.8] ${
                                  item?.replyBy?._id === ID
                                    ? 'dark:bg-perfectDarkBg bg-gray-300 px-2  rounded-full'
                                    : ''
                                } `}
                              >
                                {item?.replyBy?.userName}
                              </p>
                              <span className="text-xs mb-1  cursor-pointer opacity-[.8]">
                                • {timeAgo.format(new Date(item?.createdAt))}
                              </span>
                              {item?.replyBy?._id === user._id && (
                                <div className="edit cursor-pointer relative" onClick={() => editClick(item?._id)}>
                                  <p className="opacity-[.8]">{<BsThreeDotsVertical />}</p>
                                  {replyId === item?._id && showDelete && (
                                    <div
                                      onClick={() => deleteReply(item?._id)}
                                      className="bg-black hover:bg-perfectDarkBg text-white w-24 text-center py-1 rounded-md right-[1%] mt-1 translate-x-[50%] absolute"
                                    >
                                      Delete
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <p className="text-sm opacity-[.8]">{item?.reply}</p>

                            <div className="btns flex mt-3 gap-5 w-full">
                              <p className="flex gap-1" onClick={() => patchLike(item._id)}>
                                {item?.likes.includes(user._id) ? (
                                  <AiFillLike className="cursor-pointer text-xl text-main" />
                                ) : (
                                  <AiOutlineLike className="cursor-pointer text-xl" />
                                )}
                                {item.likes.length ? (
                                  <span className="text-sm opacity-[.8]">{item?.likes.length}</span>
                                ) : undefined}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ThreeDotsLoader />
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default RepliesCard
