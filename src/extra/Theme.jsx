import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../store/authSlice'

const Theme = () => {
  const { theme } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const changeTheme = () => {
    dispatch(setTheme())
  }
  if (theme === 'dark') {
    let html = document.querySelector('html')
    html.classList.add('dark')
  } else {
    let html = document.querySelector('html')
    html.classList.remove('dark')
  }

  return (
    <button className=" text-xl   opacity-[.8]">
      <div onClick={changeTheme}>{theme === 'dark' ? <BsFillSunFill /> : <BsFillMoonFill />}</div>
    </button>
  )
}

export default Theme
