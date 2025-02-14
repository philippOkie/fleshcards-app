function CardRateBtns({ onNext }) {
  return (
    <div className="flex justify-center gap-2">
      <button className="btn btn-outline btn-error w-32" onClick={onNext}>
        Again
      </button>

      <button className="btn btn-error w-32" onClick={onNext}>
        Hard
      </button>

      <button className="btn btn-warning w-32" onClick={onNext}>
        Good
      </button>

      <button className="btn btn-success w-32" onClick={onNext}>
        Easy
      </button>
    </div>
  );
}

export default CardRateBtns;
