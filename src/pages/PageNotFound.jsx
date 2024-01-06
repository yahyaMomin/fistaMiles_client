import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <NavBar />
      <div className="h-[90dvh] w-full flex flex-col gap-3 justify-center items-center dark:bg-black dark:text-perfectDarkBg">
        <h1 className="text-3xl">Page Not Found</h1>
        <h1 onClick={() => navigate('/home')} className="cursor-pointer text-blue-400">
          Go to Home Page --&gt;{' '}
        </h1>
      </div>
    </>
  )
}

export default PageNotFound
