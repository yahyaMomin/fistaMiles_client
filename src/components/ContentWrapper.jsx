const ContentWrapper = ({ children }) => {
  return (
    <div className="main">
      <div className="mx-2 md:mx-5">
        <div className="w-full max-w-[1200px] mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default ContentWrapper;
