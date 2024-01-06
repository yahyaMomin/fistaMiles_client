/* eslint-disable react/prop-types */
import { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaCommentDots } from 'react-icons/fa6'
import { GetData, postData } from '../utils/api'
import millify from 'millify'
import { BsFillShareFill } from 'react-icons/bs'
import BaseLine from '../extra/BaseLine'
import { RiSendPlaneFill } from 'react-icons/ri'
import { ThreeDotsLoader } from '../extra/Loader'
import Comments from './Comments'

const LikeAndCommentIcon = ({ data, user, token, patchLike, getFeedPost }) => {
  const [showComment, setShowComment] = useState(false)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('newest')

  const getComments = async (e, id) => {
    if (e === 'btn') setShowComment(!showComment)
    const res = await GetData(`comments/${id}?sortBy=${activeTab}`, token)
    console.log(res)
    setComments(res.comments)
  }
  const createComment = async (e, id) => {
    e.preventDefault()
    setLoading(true)
    const formData = {
      postId: id,
      comment,
    }
    const res = await postData('createComment', formData, token)
    setComments(res.comments)
    setLoading(false)
    setComment('')
    getFeedPost()
  }

  const tabChange = (tab) => {
    setActiveTab(tab)
    getComments()
  }
  const share = () => {}

  return (
    <div>
      <div className="info text-base flex justify-between opacity-[.8] items-center px-5">
        <div
          onClick={() => {
            patchLike(data?._id)
          }}
          className="like text-xl flex justify-end items-center gap-1 cursor-pointer "
        >
          {data?.likes.includes(user._id) ? <AiFillHeart className="text-main" /> : <AiOutlineHeart />}
          <small className="text-xs">{data?.likes?.length < 1 ? '' : millify(data?.likes.length)}</small>
        </div>
        <div className="comment flex justify-center items-center gap-1 cursor-pointer">
          <FaCommentDots onClick={() => getComments('btn', data?._id)} />
          <small className="text-xs">{data?.comments?.length < 1 ? '0' : millify(data?.comments.length)}</small>
        </div>
        <div className="share cursor-pointer">
          <BsFillShareFill onClick={share} />
        </div>
      </div>
      {showComment && (
        <div className="comments">
          <BaseLine />
          {!loading ? (
            <div className="create flex justify-between mb-5 items-center gap-4">
              <div className="userImage w-8 h-8">
                <img className="h-full w-full object-cover rounded-full" src={data?.postedBy?.avatar} alt="" />
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
              className={` tab ${activeTab === 'top' ? 'active' : undefined} bg-[#454443] ${
                activeTab === 'top'
                  ? 'bg-darkGray dark:bg-white text-white dark:text-black'
                  : 'dark:bg-[#454443] bg-lightWhite'
              } py-[2px]   px-3 rounded-md cursor-pointer`}
              onClick={() => tabChange('top')}
            >
              top
            </p>
            <p
              className={` tab ${activeTab === 'newest' ? 'active' : undefined} bg-[#454443] ${
                activeTab === 'newest'
                  ? 'bg-darkGray dark:bg-white text-white  dark:text-black'
                  : 'dark:bg-[#454443] bg-lightWhite'
              } py-1     px-3 rounded-md cursor-pointer`}
              onClick={() => tabChange('newest')}
            >
              newest
            </p>
            <p
              className={` tab ${activeTab === 'oldest' ? 'active' : undefined} bg-[#454443] ${
                activeTab === 'oldest'
                  ? 'bg-darkGray dark:bg-white text-white dark:text-black'
                  : 'dark:bg-[#454443] bg-lightWhite'
              } py-1   px-3 rounded-md cursor-pointer`}
              onClick={() => tabChange('oldest')}
            >
              oldest
            </p>
          </div>
          <Comments getComments={getComments} item={comments} post={data} />
        </div>
      )}
    </div>
  )
}

export default LikeAndCommentIcon
