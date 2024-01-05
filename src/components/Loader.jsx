import { RotatingLines } from 'react-loader-spinner'

export const LoaderSpinner = () => {
  return (
    <div className="w-full  flex-col gap-2 h-full flex justify-center items-center">
      <RotatingLines strokeColor="gray" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
      <p className="text-gray-400">please wait ...</p>
    </div>
  )
}

import { ThreeDots } from 'react-loader-spinner'

export const ThreeDotsLoader = () => {
  return (
    <div className="w-full  h-full flex justify-center items-center">
      <ThreeDots
        height="20"
        width="70"
        radius="8"
        color="gray"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  )
}
