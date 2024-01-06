import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { PatchData, deleteData } from '../utils/api'
import { LoaderSpinner, ThreeDotsLoader } from '../extra/Loader'
import RepliesCard from '../cards/RepliesCard'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

const Comments = ({ item, getComments, post }) => {
  const { user } = useSelector((state) => state.auth)
  const { token } = useSelector((state) => state.auth)
  const [data, setData] = useState([])
  const { id } = useParams()
  const [showDelete, setShowDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  const [commentId, setCommentId] = useState('')

  useEffect(() => {
    setData(item)
  }, [item])

  const showTextMsg = () => {
    setShowMsg(true)
    setTimeout(() => {
      setShowMsg(false)
    }, 1000)
  }

  const patchLike = async (commentId) => {
    const formData = {
      commentId,
    }
    await PatchData(`/likeComment`, formData, token)
    getComments('', post._id)
  }

  const DeleteComment = async (id) => {
    setLoading(true)
    await deleteData(`deleteComment/${id}`, token)
    getComments('', post._id)
    setLoading(false)
    showTextMsg()
  }

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')
  return (
    <>
      {data ? (
        <>
          {!loading ? (
            <>
              {showMsg && (
                <p className="text-center dark:bg-white bg-darkGray text-white dark:text-black rounded-full">
                  Comment Deleted !{' '}
                </p>
              )}
              {data?.map((item) => (
                <div className="mb-5" key={item?._id}>
                  <div className="flex w-full  items-center gap-2">
                    <div className="image self-start h-8 w-8">
                      <img className="w-full h-full object-cover rounded-full" src={item?.commentedBy?.avatar} alt="" />
                    </div>
                    <div className="flex flex-col ">
                      <div className="flex gap-3">
                        <p
                          className={`text-xs mb-1 hover:opacity-[1] cursor-pointer opacity-[.8] ${
                            item?.commentedBy?._id === id ? 'dark:bg-perfectDarkBg bg-gray-300 px-2 rounded-full' : ''
                          }`}
                        >
                          {item?.commentedBy?.userName}
                        </p>
                        <span className="text-xs mb-1 cursor-pointer opacity-[.8] ">
                          • {timeAgo.format(new Date(item?.createdAt))}
                        </span>
                        <div className="delete cursor-pointer">
                          {item?.commentedBy?._id === user._id && (
                            <div
                              className="edit cursor-pointer relative"
                              onClick={() => {
                                setShowDelete(!showDelete)
                                setCommentId(item?._id)
                              }}
                            >
                              <p className="opacity-[.8]">{<BsThreeDotsVertical />}</p>
                              {commentId === item?._id && showDelete && (
                                <ul className="bg-black w-28 text-center py-2 rounded-md right-[1%] translate-x-[50%] absolute">
                                  <li
                                    onClick={() => DeleteComment(item?._id)}
                                    className="hover:bg-perfectDarkBg text-white"
                                  >
                                    Delete
                                  </li>
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm opacity-[.8]">{item?.comment}</p>

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
                        <RepliesCard ID={id} getComments={getComments} item={item} post={post} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <ThreeDotsLoader />
          )}
        </>
      ) : (
        <ThreeDotsLoader />
      )}
    </>
  )
}

export default Comments
