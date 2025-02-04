function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="form-control">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
      </div>

      <div className="flex flex-col gap-2 h-170 overflow-y-auto border p-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <button key={index} className="btn btn-neutral">
            Deck {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
