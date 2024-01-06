import { useState } from 'react'
import ContentWrapper from '../wrappers/ContentWrapper'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Card from '../wrappers/Card'
import { postData } from '../utils/api'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { LoaderSpinner } from '../extra/Loader'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../store/authSlice'
import notify from '../Toast/Toast'

const Register = () => {
  const navigate = useNavigate()
  const [eye, setEye] = useState(true)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const Toggle = () => {
    setEye(!eye)
  }

  const schema = yup.object().shape({
    fullName: yup.string().required('required').max(20),
    userName: yup.string().required('required').max(20),
    email: yup.string().email('invalid email').required('required'),
    password: yup.string().min(6).required('required'),
  })

  const initialValues = {
    fullName: '',
    userName: '',
    email: '',
    password: '',
  }

  const formSubmit = async (values, action) => {
    setLoading(true)
    const res = await postData('register', values)
    if (res?.status === 'error') {
      notify('error', res.msg)
      setLoading(false)
      return
    }
    dispatch(setToken(res.token))
    dispatch(setUser(res.user))
    action.resetForm()
    setLoading(false)
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: formSubmit,
  })

  return (
    <ContentWrapper>
      <Card>
        {!loading ? (
          <>
            <h1 className="text-center mt-5 mb-10 font-semibold dark:text-main ">Register</h1>
            <form className="w-full" onSubmit={handleSubmit}>
              {/* fullname */}
              <label className=" text-xs opacity-[0.5] mt-2 text-white " htmlFor="fullName">
                FULL NAME
              </label>
              <input
                id="fullName"
                name="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                className={`w-full py-2 px-2 my-1 rounded-md inputs${
                  errors.fullName && touched.fullName ? 'border-2 border-red-400 ' : ''
                }`}
                type="text"
                placeholder="Enter Your fullName"
              />
              <div className="error">
                {errors.fullName && touched.fullName ? (
                  <small className="errors text-red-400">{errors.fullName}</small>
                ) : (
                  ''
                )}
              </div>
              <label className=" text-xs opacity-[0.5] mt-2 text-white " htmlFor="userName">
                USER NAME
              </label>
              <input
                id="userName"
                name="userName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userName}
                className={`w-full py-2 px-2 my-1 rounded-md inputs ${
                  errors.userName && touched.userName ? 'border-red-400 border-2' : ''
                }`}
                type="text"
                placeholder="Enter your userName"
                required
              />
              <div className="error">
                {errors.userName && touched.userName ? (
                  <small className="errors text-red-400">{errors.userName}</small>
                ) : (
                  ''
                )}
              </div>
              <label className=" text-xs opacity-[0.5] mt-2 text-white " htmlFor="email">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                className={`w-full py-2 px-2 my-1 rounded-md inputs${
                  errors.email && touched.email ? 'border-red-400 border-spacing-4' : ''
                }`}
                type="email"
                placeholder="name@gmail.com"
                required
              />
              <div className="error">
                {errors.email && touched.email ? <small className="errors text-red-400">{errors.email}</small> : ''}
              </div>
              <div className="inputPass relative mt-2">
                <label className=" text-xs opacity-[0.5] text-white " htmlFor="password">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  className={`w-full py-2 px-2 my-1  rounded-md inputs ${
                    errors.password && touched.password ? 'border-red-400 border-2' : ''
                  } `}
                  type={eye ? 'password' : 'text'}
                  placeholder="Password"
                  required
                />
                <span
                  onClick={Toggle}
                  className="absolute cursor-pointer icon top-[50%] bottom-[50%] right-[1%] translate-y-[-50%]  text-black opacity-[0.5] text-[25px]"
                >
                  {eye ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
              <div className="error">
                {errors.password && touched.password ? (
                  <small className="errors text-red-400 ">{errors.password}</small>
                ) : (
                  ''
                )}
              </div>

              <button
                type="submit"
                value="Register"
                className="inputs bg-[#ffdd95] text-black w-full rounded-md py-2 px-2 mt-5 mb-4 cursor-pointer"
              >
                Register
              </button>
            </form>
            <p className="text-center">
              Have an Account?
              <button onClick={() => navigate('/login')} className="dark:text-main text-black  ml-3">
                Login
              </button>
            </p>
          </>
        ) : (
          <LoaderSpinner />
        )}
      </Card>
    </ContentWrapper>
  )
}

export default Register
