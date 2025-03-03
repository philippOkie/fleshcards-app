function Card({
  showAnswerBtnClicked,
  forwardText,
  backText,
  imageUrl,
  imgForward,
  imgBack,
}) {
  return (
    <div className="card bg-transparent text-neutral-content w-290 p-4">
      <div className="flex w-full flex-col border-opacity-50 ">
        <div className="card bg-base-100 rounded-box grid h-80 flex flex-row items-center justify-center space-x-4 overflow-scroll gap-4">
          {imgForward && (
            <img
              src={imgForward}
              alt="Card Image"
              className="rounded-box h-full object-cover w-64"
            />
          )}
          <span className="text-3xl text-center w-auto">{forwardText}</span>
        </div>

        <div className="divider"></div>

        {showAnswerBtnClicked ? (
          <div className="card bg-base-100 rounded-box grid h-80 place-items-center flex justify-center overflow-scroll gap-4">
            {imgBack && (
              <img
                src={imgBack}
                alt="Card Image"
                className="rounded-box h-full object-cover w-64"
              />
            )}
            <span className="text-3xl text-center">{backText}</span>
          </div>
        ) : (
          <div className="card rounded-box grid h-80 place-items-center flex justify-center"></div>
        )}
      </div>
    </div>
  );
}

export default Card;
