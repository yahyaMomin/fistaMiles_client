import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLogOut, setTheme } from '../store/authSlice'
import Theme from '../extra/Theme'
import { AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { GetData } from '../utils/api'
import { ThreeDotsLoader } from '../extra/Loader'

const NavBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, token } = useSelector((state) => state.auth)

  const [inputVal, setInputVal] = useState('')
  const [data, setData] = useState([])
  const [dropDown, setDropDown] = useState(false)

  const handleChange = async (e) => {
    setData([])
    setInputVal(e.target.value)
    if (inputVal.length <= 1) return
    const res = await GetData(`search/${inputVal}`, token)
    setData(res.users)
  }

  return (
    <div className="navbar overflow-visible  w-full z-30">
      <div className="flex  w-full  dark:bg-darkGray border dark:border-none gap-2 bg-[#fafafa] py-2 mt-2 rounded-sm px-1   md:px-3  justify-between items-center ">
        <h1
          onClick={() => navigate('/home')}
          className=" cursor-pointer  hidden md:block  text-base md:text-xl font-mono"
        >
          Fista<span className="text-yellow-400 dark:text-main ">Miles</span>
        </h1>
        <div className="inputs relative flex justify-center  md:w-[50%] items-center flex-row w-full h-[40px] text-center">
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            value={inputVal}
            placeholder="Search Here..."
            className=" px-2 h-full md:block dark:bg-darkGray dark:border-gray-600 dark:text-white border-b-2 bg-white w-full"
          />
          <button className="text-2xl  h-full absolute top-[5%] right-[1%]   justify-center items-center opacity-[.5] hover:opacity-[1]">
            <AiOutlineSearch />
          </button>
          {inputVal && inputVal.length > 2 && (
            <div className="users absolute z-20 py-3 top-[100%] mt-3 w-full bg-lightWhite  dark:bg-black rounded-lg ">
              {data ? (
                <>
                  {data?.map((data) => (
                    <div key={data?._id} className="flex mb-3 px-4 justify-start items-center gap-5">
                      <div className="avatar">
                        <div className="h-10 w-10 relative rounded-full">
                          <img className="h-full w-full object-cover rounded-full" src={data?.avatar} alt="user" />
                        </div>
                      </div>
                      <div
                        className="userName cursor-pointer"
                        onClick={() => {
                          navigate(`/profile/${data?._id}`)
                          setInputVal('')
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <p>{data?.userName}</p>
                          <small className="opacity-[.7]">{data?.fullName}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>{data?.length <= 0 ? <p>Result Not found.</p> : <ThreeDotsLoader />}</>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-5 ml-2   justify-center  items-center">
          <div className="theme hidden md:block">
            <Theme />
          </div>
          <button
            onClick={() => setDropDown(!dropDown)}
            className="h-10 w-10 relative rounded-full"
            name="user"
            id="user"
          >
            <img className="h-full w-full object-cover rounded-full" src={user.avatar} alt="user profile" />
            {dropDown && (
              <ul className="z-40 top-[130%] bg-lightWhite py-3 rounded-md w-[100px] dark:bg-lightGray absolute right-[10%]">
                <li
                  className="hover:bg-[#cbcdd1]  mb-1 w-full hover:dark:bg-white  py-1 hover:text-black"
                  onClick={() => navigate('/')}
                >
                  profile
                </li>
                <li className=" mb-1 w-full hover:dark:bg-white hover:bg-[#cbcdd1] py-1 hover:text-black">setting</li>
                <li
                  className=" hover:dark:bg-white hover:bg-[#cbcdd1] py-1 hover:text-black mb-1 w-full"
                  onClick={() => dispatch(setTheme())}
                >
                  theme
                </li>
                <li
                  className="hover:dark:bg-white hover:bg-[#cbcdd1] py-1 hover:text-black w-full"
                  onClick={() => dispatch(setLogOut())}
                >
                  logOut
                </li>
              </ul>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar
