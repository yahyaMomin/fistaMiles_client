import { AiFillFileImage, AiOutlinePaperClip } from "react-icons/ai";
import BaseLine from "./BaseLine";
import { useState } from "react";
import { FaVideo, FaXmark } from "react-icons/fa6";
import { useFormik } from "formik";
import { postData } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDotsLoader } from "./Loader";
import { setUser } from "../store/authSlice";

const MyPostCard = ({ data, getFeedPost }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFieldValue("image", file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const initialValues = {
    description: "",
  };

  const submitForm = async (values, { resetForm }) => {
    setImagePreview(null);
    setLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    const res = await postData("createPost", formData, token);
    alert(res?.msg);
    resetForm();
    setLoading(false);
    dispatch(setUser(res.user));
    getFeedPost();
  };

  const { handleBlur, handleChange, values, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: submitForm,
  });

  return (
    <div className="flex flex-col">
      <>
        <form onSubmit={handleSubmit}>
          <div className="flex  gap-2 items-center">
            <div className="userImage h-12 w-12">
              <img
                className="h-full w-full object-cover rounded-full"
                src={`${import.meta.env.VITE_APP_USER_URL}/${data?.avatar}`}
                alt=""
              />
            </div>

            <div className="input w-full">
              <input
                type="text"
                placeholder="Create Post..."
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                name="description"
                id="description"
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
                className="btn disabled:cursor-no-drop bg-main hover:opacity-[.7]  text-black px-3 py-1 rounded-md"
                disabled={imagePreview === null}
              >
                Post
              </button>

              <input type="file" className="hidden" onChange={handleImageChange} id="post" name="post" />
            </div>
          ) : (
            <div className="text-center flex justify-center items-center">
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
            ""
          )}
        </div>
      </>
    </div>
  );
};

export default MyPostCard;
