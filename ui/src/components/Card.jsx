function Card({ props }) {
  return (
    <div className="card bg-neutral text-neutral-content w-180 p-4">
      <div className="flex w-full flex-col border-opacity-50">
        <div className="card bg-base-300 rounded-box grid h-80 place-items-center flex justify-center text-5xl">
          {props.forwardText}
        </div>
        <div className="divider"></div>
        <div className="card bg-base-300 rounded-box grid h-80 place-items-center flex justify-center text-5xl">
          {props.backText}
        </div>
      </div>
    </div>
  );
}

export default Card;
