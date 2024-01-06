const Card = ({ children }) => {
  return (
    <div className="flex justify-center items-center mx-auto min-h-[100dvh] h-fit md:w-[670px] w-full">
      <div className=" p-4 border  dark:border-none  rounded-[7px] bg-white dark:bg-darkGray mx-auto w-full">
        {children}
      </div>
    </div>
  )
}

export default Card
