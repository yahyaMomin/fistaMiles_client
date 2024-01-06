import { AiFillFileImage, AiOutlinePaperClip } from 'react-icons/ai'
import BaseLine from '../extra/BaseLine'
import { useState } from 'react'
import { FaVideo, FaXmark } from 'react-icons/fa6'
import { postData } from '../utils/api'
import { useSelector } from 'react-redux'
import { ThreeDotsLoader } from '../extra/Loader'

import storage from '../utils/fireBaseConfig'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import notify from '../Toast/Toast'

const MyPostCard = ({ data, getFeedPost }) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dec, setDec] = useState('')
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState(null)

  const { token } = useSelector((state) => state.auth)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setImagePreview(null)

    try {
      const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        },
        (error) => {
          notify('error', error.message)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            const formData = {
              description: dec,
              url: downloadURL,
            }

            const res = await postData('createPost', formData, token)
            setDec('')
            notify('success', 'new Post Created')
            setLoading(false)
            getFeedPost()
          } catch (error) {
            notify('error', error.message)
            setLoading(false)
          }
        }
      )
    } catch (error) {
      console.log(error.message)
      notify('error', error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex  gap-2 items-center">
            <div className="userImage h-12 w-12">
              <img className="h-full w-full object-cover rounded-full" src={data?.avatar} alt="" />
            </div>

            <div className="input w-full">
              <input
                type="text"
                placeholder="Create Post..."
                onChange={(e) => setDec(e.target.value)}
                value={dec}
                className="w-full py-3 px-2 rounded-xl bg-lightWhite dark:text-white dark:bg-lightGray"
              />
            </div>
          </div>
          <BaseLine />
          {!loading ? (
            <div className="flex items-center justify-between">
              <button type="button" className="flex">
                <label htmlFor="post">
                  <div className="flex gap-1 justify-center items-center opacity-[.5]">
                    <AiFillFileImage />
                    <small className="cursor-pointer">Image</small>
                  </div>
                </label>
              </button>

              <button type="button" className="flex">
                <label htmlFor="post">
                  <div className="flex justify-center items-center gap-1 opacity-[.5]">
                    <FaVideo />
                    <small className="cursor-pointer">Video</small>
                  </div>
                </label>
              </button>

              <button type="button" className="flex">
                <label htmlFor="post">
                  <div className="flex justify-center items-center gap-1 opacity-[.5]">
                    <AiOutlinePaperClip />
                    <small className="cursor-pointer">GIF</small>
                  </div>
                </label>
              </button>

              <button
                type="submit"
                className="btn disabled:cursor-no-drop bg-main hover:opacity-[.7]  text-black px-3 py-1 rounded-sm"
                disabled={imagePreview === null}
              >
                Post
              </button>

              <input type="file" className="hidden" onChange={handleImageChange} id="post" name="post" />
            </div>
          ) : (
            <div className="text-center flex flex-col gap-3 justify-center items-center">
              <div className="progress opacity-[.7]">Upload is {progress}% done</div>
              <ThreeDotsLoader />
            </div>
          )}

          <BaseLine />
        </form>

        <div className="pre flex justify-center items-center">
          {imagePreview ? (
            <div className="w-full relative  max-w-[465px]  ">
              <p
                onClick={() => setImagePreview(null)}
                className="absolute bg-darkGray cursor-pointer hover:bg-red-500  top-1 p-2 rounded-full right-[1%]"
              >
                <FaXmark />
              </p>
              <img className=" max-h-[468px]  h-full w-full rounded-md" src={imagePreview} />
            </div>
          ) : (
            ''
          )}
        </div>
      </>
    </div>
  )
}

export default MyPostCard
