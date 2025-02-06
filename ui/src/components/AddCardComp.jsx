function AddCardComp() {
  return (
    <div className="rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8">
      <div className="flex flex-row items-center gap-8 flex-1">
        <input
          type="text"
          placeholder="Type your text here!"
          className="input w-full"
        />
        <div className="btn btn-square flex items-center justify-center text-3xl font-bold bg-base-100 w-16 h-16">
          img
        </div>
      </div>

      <div className="divider divider-horizontal"></div>

      <div className="flex flex-row items-center gap-8 flex-1">
        <input
          type="text"
          placeholder="Type your text here!"
          className="input w-full"
        />
        <div className="btn btn-square flex items-center justify-center text-3xl font-bold bg-base-100 w-16 h-16">
          img
        </div>
      </div>
    </div>
  );
}

export default AddCardComp;
