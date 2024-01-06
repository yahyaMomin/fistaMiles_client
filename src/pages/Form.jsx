import { useEffect, useState } from 'react'
import ContentWrapper from '../wrappers/ContentWrapper'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Card from '../wrappers/Card'
import { postData } from '../utils/api'
import * as yup from 'yup'
import { LoaderSpinner } from '../extra/Loader'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../store/authSlice'
import notify from '../Toast/Toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const Form = () => {
  const [eye, setEye] = useState(true)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState('login')

  const dispatch = useDispatch()

  const Toggle = () => {
    setEye(!eye)
  }

  const defaultValues = {
    fullName: '',
    userName: '',
    email: '',
    password: '',
  }
  const registerSchema = yup.object().shape({
    fullName: yup.string().required('this field is required').max(20),
    userName: yup.string().required('this field is required').max(20),
    email: yup.string().email('invalid email').required('this field is required'),
    password: yup.string().min(6).required('this field is required'),
  })
  const loginSchema = yup.object().shape({
    email: yup.string().email('invalid email').required('this field is required'),
    password: yup.string().min(6).required('this field is required'),
  })
  const { register, reset, formState, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(page === 'login' ? loginSchema : registerSchema),
  })
  const { errors } = formState

  const registerForm = async (values) => {
    setLoading(true)
    const res = await postData('register', values)
    if (res?.status === 'error') {
      notify('error', res.msg)
      setLoading(false)
      return
    }
    dispatch(setToken(res.token))
    dispatch(setUser(res.user))
    reset()
    setLoading(false)
  }

  const loginForm = async (values) => {
    setLoading(true)
    delete values.fullName
    delete values.userName
    const res = await postData('login', values)
    if (res?.status === 'error') {
      notify('error', res.msg)
      setLoading(false)
      return
    }
    dispatch(setToken(res.token))
    dispatch(setUser(res.user))
    reset()
    setLoading(false)
  }

  const formSubmit = (values) => {
    page === 'register' ? registerForm(values) : loginForm(values)
  }

  useEffect(() => {
    reset()
  }, [page])

  return (
    <ContentWrapper>
      <Card>
        {!loading ? (
          <>
            <h1 className="text-center mt-5 mb-10 font-semibold dark:text-main ">
              {page === 'login' ? 'LOGIN TO YOUR ACCOUNT' : 'CREATE AN ACCOUNT'}
            </h1>
            <form className="w-full" onSubmit={handleSubmit(formSubmit)}>
              {page === 'register' && (
                <>
                  <label className=" text-xs  mt-2 text-white " htmlFor="fullName">
                    FULL NAME
                  </label>
                  <input
                    id="fullName"
                    {...register('fullName')}
                    className={`w-full py-2 px-2 my-1 rounded-sm inputs${
                      errors.fullName && 'border-2 border-red-400 '
                    }`}
                    type="text"
                    placeholder="Enter Your fullName"
                  />
                  <div className="error">
                    {errors.fullName && <small className="errors text-red-400">{errors.fullName.message}</small>}
                  </div>
                  <label className=" text-xs  mt-2 text-white " htmlFor="userName">
                    USER NAME
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    {...register('userName')}
                    className={`w-full py-2 px-2 my-1 rounded-sm inputs`}
                    type="text"
                    placeholder="Enter your userName"
                  />
                  <div className="error">
                    {errors.userName && <small className="errors text-red-400">{errors.userName.message}</small>}
                  </div>
                </>
              )}
              <label className=" text-xs  mt-2 text-white " htmlFor="email">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                {...register('email')}
                className={`w-full py-2 px-2 my-1 rounded-sm inputs`}
                type="email"
                placeholder="name@gmail.com"
              />
              <div className="error">
                {errors.email && <small className="errors text-red-400">{errors.email.message}</small>}
              </div>
              <div className="inputPass relative mt-2">
                <label className=" text-xs  text-white " htmlFor="password">
                  PASSWORD
                </label>
                <input
                  id="password"
                  {...register('password')}
                  className={`w-full py-2 px-2 my-1  rounded-sm inputs `}
                  type={eye ? 'password' : 'text'}
                  placeholder="Password"
                />
                <span
                  onClick={Toggle}
                  className="absolute cursor-pointer icon top-[50%] bottom-[50%] right-[1%] translate-y-[-50%]  text-black  text-[25px]"
                >
                  {eye ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
              <div className="error">
                {errors.password && <small className="errors text-red-400 ">{errors.password.message}</small>}
              </div>

              <button
                type="submit"
                value="Register"
                className="inputs bg-main text-black w-full rounded-sm py-2 px-2 mt-5 mb-4 cursor-pointer"
              >
                Register
              </button>
            </form>
            {page === 'register' ? (
              <p className="text-center">
                Have an Account?
                <button onClick={() => setPage('login')} className="dark:text-main text-black  ml-3">
                  Login
                </button>
              </p>
            ) : (
              <p className="text-center">
                Don&apos;t have an Account?
                <button onClick={() => setPage('register')} className="dark:text-main text-black  ml-3">
                  register
                </button>
              </p>
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </Card>
    </ContentWrapper>
  )
}

export default Form
