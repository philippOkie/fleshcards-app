function Card({ showAnswerBtnClicked, props }) {
  return (
    <div className="card bg-neutral text-neutral-content w-290 p-4">
      <div className="flex w-full flex-col border-opacity-50">
        <div className="card bg-base-100 rounded-box grid h-80 place-items-center flex justify-center text-5xl">
          {props.forwardText}
        </div>

        <div className="divider"></div>
        {showAnswerBtnClicked ? (
          <div className="card bg-base-100 rounded-box grid h-80 place-items-center flex justify-center text-5xl">
            {props.backText}
          </div>
        ) : (
          <div className="card rounded-box grid h-80 place-items-center flex justify-center text-5xl">
            <span>Answer is here!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
