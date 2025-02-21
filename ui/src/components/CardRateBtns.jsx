function CardRateBtns({ onRate }) {
  return (
    <div className="flex justify-center gap-2">
      <button
        className="btn btn-outline btn-error w-32"
        onClick={() => onRate(1)}
      >
        Again
      </button>

      <button className="btn btn-error w-32" onClick={() => onRate(2)}>
        Hard
      </button>

      <button className="btn btn-warning w-32" onClick={() => onRate(3)}>
        Good
      </button>

      <button className="btn btn-success w-32" onClick={() => onRate(4)}>
        Easy
      </button>
    </div>
  );
}

export default CardRateBtns;
