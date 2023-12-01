import { useState } from "react";
import ContentWrapper from "../components/ContentWrapper";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useFormik } from "formik";
import * as yup from "yup";
import { postData } from "../utils/api";
import { useDispatch } from "react-redux";
import { setMsg, setToken, setUser } from "../store/authSlice";
import { LoaderSpinner } from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isErr, setIsErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const Toggle = () => {
    setEye(!eye);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required("required"),
    password: yup.string().min(6).required("required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const submitForm = async (values, actions) => {
    setLoading(true);
    const res = await postData("login", values);
    console.log(res);

    if (res?.status === "error") {
      setIsErr(res?.error);
      setLoading(false);
      return;
    }
    console.log(res);
    setLoading(false);
    dispatch(setToken(res.accessToken));
    dispatch(setMsg(res.msg));
    dispatch(setUser(res.user));
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: submitForm,
  });

  return (
    <ContentWrapper>
      <Card>
        {!loading ? (
          <>
            <h1 className="text-center mt-5 mb-4 font-semibold text-main ">Welcome Back !</h1>
            <form onSubmit={handleSubmit} action="">
              {isErr !== "" ? <div className="text-red-400 text-center">{isErr}</div> : ""}
              <label className=" text-xs opacity-[0.8] mt-2 text-black dark:text-white   " htmlFor="email">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                className={`w-full py-2 px-2 my-1 rounded-md inputs${
                  errors.email && touched.email ? "  border-2 border-red-600 outline-red-500" : ""
                }`}
                type="email"
                placeholder="name@gmail.com"
                required
              />
              <div className="error">
                {errors.email && touched.email ? (
                  <small className="errors  text-red-400 uppercase">{errors.email}</small>
                ) : (
                  ""
                )}
              </div>
              <div className="inputPass relative mt-2">
                <label className=" text-xs opacity-[0.8] mt-2 text-black dark:text-white " htmlFor="password">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  className={`w-full py-2 px-2 my-1  border dark:border-none focus:outline-none rounded-md inputs ${
                    errors.password && touched.password ? "border-red-400 border-2" : ""
                  } `}
                  type={eye ? "password" : "text"}
                  placeholder="Password"
                  required
                />
                <span
                  onClick={Toggle}
                  className="absolute icon top-[50%] bottom-[50%] cursor-pointer right-[1%] translate-y-[-50%] text-darkGray opacity-[0.5] text-[25px]"
                >
                  {eye ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
              <div className="error">
                {errors.password && touched.password ? (
                  <small className="errors text-red-400 uppercase">{errors.password}</small>
                ) : (
                  ""
                )}
              </div>

              <button
                type="submit"
                className={`inputs bg-main text-[#000] mt-5 font-semibold w-full rounded-md text-center py-2 px-2  mb-4 cursor-pointer ${
                  isSubmitting ? "opacity-[0.5]" : ""
                }`}
                disabled={isSubmitting}
              >
                Login
              </button>
            </form>
            <p className="text-center mb-5">
              do not Have an Account?
              <button onClick={() => navigate("/register")} className="text-main ml-3">
                Register
              </button>
            </p>
          </>
        ) : (
          <LoaderSpinner />
        )}
      </Card>
    </ContentWrapper>
  );
};

export default Login;
