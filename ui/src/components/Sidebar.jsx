function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="form-control pr-4">
        <input
          type="text"
          placeholder="Search by name or topic"
          className="input input-bordered w-24 md:w-auto"
        />
      </div>

      <div className="flex flex-col gap-2 h-162 overflow-y-auto border pr-4">
        {Array.from({ length: 50 }).map((_, index) => (
          <button key={index} className="btn btn-neutral">
            Deck {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
