import { useFormik } from "formik";
import Card from "../components/Card";
import { LoaderSpinner } from "../components/Loader";
import NavBar from "../components/NavBar";

import { useSelector } from "react-redux";
import * as yup from "yup";
import { useState } from "react";
import { putData } from "../utils/api";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [msg, setMsg] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    fullName: user.fullName,
    userName: user.userName,
    bio: user.bio,
    profession: user.profession,
    location: user.location,
    instagram: user.instagram,
    twitter: user.twitter,
    linkedin: user.linkedin,
  };

  const schema = yup.object().shape({
    fullName: yup.string().required("required").max(11),
    userName: yup.string().required("required").max(11),
  });

  const imageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
      console.log(event);
    };
    reader.readAsDataURL(file);
    setFieldValue("avatar", file);
  };

  const submitForm = async (values, { resetForm }) => {
    console.log(values);
    setLoading(true);
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }
    const data = await putData("/updateProfile", formData, token);
    setMsg(data?.msg);
    dispatch(setUser(data?.user));
    dispatch(setToken(data?.token));
    setPreview("");
    setLoading(false);
    resetForm();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const { errors, handleBlur, handleChange, values, touched, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: submitForm,
  });

  return (
    <>
      <NavBar />
      <Card>
        {!loading ? (
          <form onSubmit={handleSubmit}>
            {msg && (
              <div className="msg flex py-3 justify-center items-center gap-2 bg-white text-black rounded-2xl">
                <h1 className="text-center">{msg} </h1>
                <p className="text-blue-500 cursor-pointer " onClick={() => navigate("/")}>
                  go to home page
                </p>
              </div>
            )}
            <div className="input flex flex-col gap-5">
              <h1 className="text-center font-semibold opacity-[.7]">UPDATE PROFILE</h1>
              <div className="image flex justify-between border-lightWhite">
                <div className="userImage">
                  <label htmlFor="image" className="text-sm">
                    <span className="opacity-[.7]">PROFILE IMAGE</span>
                    <div className="img h-14 w-14 cursor-pointer rounded-full ">
                      <img
                        src={`${import.meta.env.VITE_APP_USER_URL}/${user.avatar}`}
                        className="rounded-full h-full w-full object-cover"
                        alt="user image"
                      />
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
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg`}
                />
                <div className="w-full text-red-400 capitalize">
                  {errors.fullName && touched.fullName && <small>{errors.fullName}</small>}
                </div>
              </div>

              <div className="userName">
                <label htmlFor="userName" className="text-sm opacity-[0.8]">
                  USER NAME
                </label>
                <input
                  placeholder="Enter UserName"
                  id="userName"
                  name="userName"
                  type="text"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
                />
                <div className="w-full text-red-400 capitalize">
                  {errors.userName && touched.userName && <small>{errors.userName}</small>}
                </div>
              </div>
              <div className="bio w-full">
                <label htmlFor="userName" className="text-sm opacity-[0.8]">
                  BIO
                </label>
                <textarea
                  onChange={handleChange}
                  value={values.bio}
                  onBlur={handleBlur}
                  name="bio"
                  id="bio"
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5] h-fit w-full dark:bg-[#302f2f] text-black dark:text-white px-2 py-3 rounded-lg"
                >
                  {user?.bio}
                </textarea>
              </div>
              <div className="location">
                <label htmlFor="location" className="text-sm opacity-[0.8]">
                  LOCATION
                </label>
                <input
                  placeholder="Enter your location"
                  id="location"
                  name="location"
                  type="text"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
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
                  value={values.profession}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
                />
              </div>

              <div className="instagram">
                <label htmlFor="userName" className="text-sm opacity-[0.8]">
                  INSTAGRAM
                </label>
                <input
                  placeholder="paste your instagram link"
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={values.instagram}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
                />
              </div>
              <div className="twitter">
                <label htmlFor="twitter" className="text-sm opacity-[0.8]">
                  TWITTER
                </label>
                <input
                  placeholder="paste your twitter link"
                  id="twitter"
                  name="twitter"
                  type="text"
                  value={values.twitter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
                />
              </div>
              <div className="linkedin">
                <label htmlFor="linkedin" className="text-sm opacity-[0.8]">
                  LINKEDIN
                </label>
                <input
                  placeholder="paste your linkedin link"
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={values.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 bg-lightWhite dark:border-none opacity-[.5]  w-full dark:bg-[#302f2f] dark:text-white px-2 py-3 rounded-lg"
                />
              </div>
              <div className="btns flex justify-center gap-5">
                <button
                  className="bg-red-300 text-black p-1 px-3  rounded-md"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  cancel
                </button>
                <button type="submit" className="bg-main text-black p-1 px-3  rounded-md">
                  update
                </button>
              </div>
            </div>
          </form>
        ) : (
          <LoaderSpinner />
        )}
      </Card>
    </>
  );
};

export default UpdateProfile;
