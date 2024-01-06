import { AiFillHeart } from 'react-icons/ai'
import BaseLine from '../extra/BaseLine'

const PostImage = ({ patchLike, data, showAni, id }) => {
  return (
    <div className="image">
      <div className=" flex justify-center items-center">
        <div className="w-full relative  max-w-[465px]  ">
          <img
            onDoubleClick={() => patchLike(data?._id)}
            className=" max-h-[480px]  h-full w-full  rounded-md"
            src={data?.image}
          />
          {showAni && id === data?._id && (
            <div className="animation  absolute top-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
              <AiFillHeart size={30} className="text-main" />
            </div>
          )}
        </div>
      </div>
      <BaseLine />
    </div>
  )
}

export default PostImage
