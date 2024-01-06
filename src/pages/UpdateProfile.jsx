import Card from '../wrappers/Card'
import { LoaderSpinner } from '../extra/Loader'
import NavBar from '../components/NavBar'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import notify from '../Toast/Toast'

import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { useState } from 'react'
import { putData } from '../utils/api'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import storage from '../utils/fireBaseConfig'

const UpdateProfile = () => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  const [msg, setMsg] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const defaultValues = {
    fullName: user.fullName,
    userName: user.userName,
    bio: user.bio,
    profession: user.profession,
    location: user.location,
    instagram: user.instagram,
    twitter: user.twitter,
    linkedin: user.linkedin,
  }

  const schema = yup.object().shape({
    fullName: yup.string().required('required').max(20),
    userName: yup.string().required('required').max(20).matches(/^\S+$/, "Use underScore '_' instead of empty space "),
  })

  const { register, handleSubmit, formState } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const { errors } = formState

  const imageChange = (event) => {
    const file = event.target.files[0]
    setFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const submitForm = async (values) => {
    setLoading(true)
    try {
      if (file) {
        const storageRef = ref(storage, `users/${Date.now()}-${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            setProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
          },
          (error) => {
            console.log(error.message)
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

              const formData = {
                ...values,
                url: downloadURL,
              }

              const data = await putData('updateProfile', formData, token)
              if (data?.status === 'success') {
                dispatch(setUser(data?.user))
                dispatch(setToken(data?.token))
                setPreview('')
                setLoading(false)
                notify('success', 'profile updated')
                setTimeout(() => {
                  navigate('/home')
                }, 1000)
              } else {
                setLoading(false)
                notify('error', data?.msg)
              }
            } catch (error) {
              console.log(error.message)
            }
          }
        )
      } else {
        const data = await putData('updateProfile', values, token)
        if (data?.status === 'success') {
          dispatch(setUser(data?.user))
          dispatch(setToken(data?.token))
          setPreview('')
          setLoading(false)
          notify('success', 'profile updated')
          setTimeout(() => {
            navigate('/')
          }, 1000)
        } else {
          notify('error', data?.msg)
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <NavBar />
      <div className="my-2">
        <Card>
          {!loading ? (
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="input flex flex-col gap-5">
                <h1 className="text-center font-semibold opacity-[.7]">UPDATE PROFILE</h1>
                <div className="image flex justify-between border-lightWhite">
                  <div className="userImage">
                    <label htmlFor="image" className="text-sm">
                      <span className="opacity-[.7]">PROFILE IMAGE</span>
                      <div className="img h-14 w-14 cursor-pointer rounded-full ">
                        <img src={user?.avatar} className="rounded-full h-full w-full object-cover" alt="user image" />
                      </div>
                    </label>
                    <input id="image" name="image" type="file" onChange={imageChange} className="hidden" />
                  </div>
                  {preview.length >= 1 && (
                    <div className="preview">
                      <span className="opacity-[.7]">PREVIEW IMAGE</span>
                      <div className="img h-14 w-14 cursor-pointer rounded-full ">
                        <img src={preview} className="rounded-full h-full w-full object-cover" alt="user image" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="fullName">
                  <label htmlFor="fullName" className="text-sm opacity-[0.8]">
                    FULL NAME
                  </label>
                  <input
                    placeholder="Enter FullName"
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className={` bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded`}
                  />
                  <div className="w-full text-red-400 capitalize">
                    {errors.fullName && <small>{errors.fullName.message}</small>}
                  </div>
                </div>

                <div className="userName">
                  <label htmlFor="userName" className="text-sm opacity-[0.8]">
                    USER NAME
                  </label>
                  <input
                    placeholder="Enter UserName"
                    id="userName"
                    type="text"
                    {...register('userName')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                  <div className="w-full text-red-400 capitalize">
                    {errors.userName && <small>{errors.userName.message}</small>}
                  </div>
                </div>
                <div className="bio w-full">
                  <label htmlFor="bio" className="text-sm opacity-[0.8]">
                    BIO
                  </label>
                  <textarea
                    {...register('bio')}
                    id="bio"
                    type="text"
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8] h-fit w-full dark:bg-[#302f2f] text-black dark:text-white px-2 py-3 rounded"
                  />
                </div>
                <div className="location">
                  <label htmlFor="location" className="text-sm opacity-[0.8]">
                    LOCATION
                  </label>
                  <input
                    placeholder="Enter your location"
                    id="location"
                    type="text"
                    {...register('location')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                </div>
                <div className="profession">
                  <label htmlFor="profession" className="text-sm opacity-[0.8]">
                    PROFESSION
                  </label>
                  <input
                    placeholder="Enter your profession"
                    id="profession"
                    name="profession"
                    type="text"
                    {...register('profession')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                </div>

                <div className="instagram">
                  <label htmlFor="userName" className="text-sm opacity-[0.8]">
                    INSTAGRAM
                  </label>
                  <input
                    placeholder="paste your instagram link"
                    id="instagram"
                    type="text"
                    {...register('instagram')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                </div>
                <div className="twitter">
                  <label htmlFor="twitter" className="text-sm opacity-[0.8]">
                    TWITTER
                  </label>
                  <input
                    placeholder="paste your twitter link"
                    id="twitter"
                    type="text"
                    {...register('twitter')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                </div>
                <div className="linkedin">
                  <label htmlFor="linkedin" className="text-sm opacity-[0.8]">
                    LINKEDIN
                  </label>
                  <input
                    placeholder="paste your linkedin link"
                    id="linkedin"
                    type="text"
                    {...register('linkedin')}
                    className="border-2 bg-lightWhite dark:border-none opacity-[.8]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded"
                  />
                </div>
                <div className="btns flex justify-center gap-5">
                  <button
                    className="bg-red-300 text-black p-1 px-3  rounded-sm"
                    type="button"
                    onClick={() => navigate('/home')}
                  >
                    cancel
                  </button>
                  <button type="submit" className="bg-main text-black p-1 px-3  rounded-sm">
                    update
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <LoaderSpinner />
          )}
        </Card>
      </div>
    </>
  )
}

export default UpdateProfile
