function ShowAnswerBtn({ onShowAnswerBtnClick }) {
  return (
    <button
      className="btn btn-wide btn-active btn-primary btn-lg !text-2xl"
      onClick={onShowAnswerBtnClick}
    >
      <span className="animate-pulse">Show Answer</span>
    </button>
  );
}

export default ShowAnswerBtn;
