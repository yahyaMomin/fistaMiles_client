/* eslint-disable react/prop-types */
import { ThreeDotsLoader } from '../extra/Loader'
import { useState } from 'react'
import { PatchData } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { updatePosts } from '../store/authSlice'
import PostDetail from '../components/PostDetail'
import PostImage from '../components/PostImage'
import LikeAndCommentIcon from '../components/LikeAndCommentIcon'

const PostsCard = ({ getFeedPost, data }) => {
  const [showAni, setShowAni] = useState(false)
  const [ID, setID] = useState('')

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { token } = useSelector((state) => state.auth)

  // patch Like
  const patchLike = async (id) => {
    setID(id)
    setShowAni(true)
    const formData = {
      postId: id,
    }
    const res = await PatchData('likeUnlike', formData, token)
    dispatch(updatePosts(res.post))

    setShowAni(false)
    getFeedPost()
  }

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
  )
}

export default PostsCard
