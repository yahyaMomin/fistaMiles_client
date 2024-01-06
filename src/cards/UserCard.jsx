/* eslint-disable react/prop-types */
import BaseLine from '../extra/BaseLine'
import { FaLocationDot, FaXTwitter, FaLinkedin, FaBagShopping } from 'react-icons/fa6'
import { BiSolidEdit } from 'react-icons/bi'
import { BsInstagram } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { PatchData } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/authSlice'

const UserCard = ({ getUser, data, isProfile }) => {
  const { token, user } = useSelector((state) => state.auth)

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')

  const Navigate = useNavigate()
  const dispatch = useDispatch()

  const followHandle = async (id) => {
    const res = await PatchData(`/follow/${id}`, { id }, token)
    getUser()
    dispatch(setUser(res?.user))
  }

  return (
    <>
      {data && (
        <div className="userBox">
          <div className="flex justify-between gap-2 items-center">
            <div className="flex gap-2">
              <div className="img h-12 w-12 ">
                <img className="h-full w-full cursor-pointer rounded-full object-cover" src={data?.avatar} alt="user" />
              </div>

              <div className="flex  justify-center gap-1 flex-col">
                <h1 className="text-sm font-semibold">{data?.userName}</h1>
                <p className="text-xs opacity-[.7]">{data?.fullName}</p>
              </div>
            </div>

            {!isProfile || user?._id === data?._id ? (
              <button onClick={() => Navigate('/updateProfile')}>
                <BiSolidEdit />
              </button>
            ) : (
              <button
                className={` hover:opacity-[.8] w-24   border dark:border-transparent rounded-lg `}
                onClick={() => {
                  followHandle(data?._id)
                }}
              >
                {data?.followers?.includes(user?._id) ? (
                  <h6 className="py-1 rounded-full bg-lightWhite dark:bg-lightGray">Following</h6>
                ) : (
                  <h6 className="py-1 rounded-full bg-main text-black">Follow</h6>
                )}
              </button>
            )}
          </div>

          <BaseLine />

          <div className="flex justify-around  md:justify-between dark:opacity-[0.8]">
            <div className="flex flex-col justify-center items-center">
              <p>Posts</p>
              <p className="py-1 px-3 bg-lightWhite dark:bg-lightGray  cursor-pointer rounded-md">
                {data?.posts.length}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p>Followers</p>
              <p className="py-1 px-3 bg-lightWhite dark:bg-lightGray cursor-pointer rounded-md">
                {data?.followers.length}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p>Following</p>
              <p className="py-1 px-3  bg-lightWhite dark:bg-lightGray cursor-pointer rounded-md">
                {data?.following.length}
              </p>
            </div>
          </div>

          <BaseLine />

          <div className="flex flex-col gap-3 opacity-[.7]">
            <small>bio</small>
            <textarea
              value={data?.bio}
              disabled
              placeholder="Bio..."
              className="w-full h-fit text-sm dark:bg-darkGray  dark:border-[#36383b] border-2 p-2 rounded-md "
            ></textarea>
          </div>

          <BaseLine />

          <div className="location flex flex-col gap-2 text-sm opacity-[.7]">
            <div className="flex justify-between items-center">
              <div className="flex  gap-1 items-center">
                <FaLocationDot />
                {data?.location ? <p>{data?.location}</p> : <p>no location</p>}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <FaBagShopping />
                {data?.profession ? <p>{data?.profession}</p> : <p>no profession</p>}
              </div>
            </div>
          </div>
          <BaseLine />
          <div className="friends flex flex-col text-sm opacity-[.7]  gap-4">
            <div className="flex justify-between">
              <p>Joined</p>
              <p>{timeAgo.format(new Date(data?.createdAt))}</p>
            </div>
          </div>
          <BaseLine />
          <div className="links text-sm flex flex-col gap-3 opacity-[.7]">
            <h1 className="text-lg">Social Profiles</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center  gap-2">
                <BsInstagram />
                {data?.instagram ? (
                  <a className="text-blue-400" href={data?.instagram}>
                    go to instagram profile
                  </a>
                ) : (
                  <p>no instagram</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center  gap-2">
                <FaXTwitter />
                {data?.twitter ? (
                  <a className="text-blue-400" href={data?.twitter}>
                    go to twitter profile
                  </a>
                ) : (
                  <p>no twitter</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center  gap-2">
                <FaLinkedin />
                {data?.linkedin ? (
                  <a className="text-blue-400" href={data?.linkedin}>
                    go to linkedIn profile
                  </a>
                ) : (
                  <p>no linkedIn</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserCard
