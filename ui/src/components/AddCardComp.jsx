function AddCardComp() {
  return (
    <div className="rounded-2xl bg-neutral text-neutral-content w-auto p-4 pl-12 pr-12 flex flex-row items-center gap-8">
      <div className="flex flex-row items-center gap-8">
        <input
          type="text"
          placeholder="Type here!"
          className="input w-full max-w-xs w-lg"
        />
        <div className="cursor-pointer select-none">
          <div className="w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-xl bg-base-100">
            +
          </div>
        </div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="flex flex-row items-center gap-8">
        <input
          type="text"
          placeholder="Type here!"
          className="input w-full max-w-xs w-lg"
        />
        <div className="cursor-pointer select-none">
          <div className="w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-xl bg-base-100">
            +
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCardComp;
