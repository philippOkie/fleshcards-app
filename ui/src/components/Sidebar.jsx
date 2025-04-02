function Sidebar({
  decks = [],
  selectedDeck,
  searchTerm,
  onSearchChange,
  onDeckClick,
}) {
  return (
    <div className="flex flex-col gap-6 w-64">
      <div className="form-control w-full">
        <input
          type="text"
          placeholder="Search by name or topics"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 h-96 overflow-y-auto">
        {decks.length > 0 ? (
          decks.map((deck) => (
            <button
              key={deck.id}
              className={`btn w-64 ${
                deck.id === selectedDeck ? "btn-primary" : "btn-neutral"
              }`}
              onClick={() => onDeckClick(deck.id)}
            >
              <span className="truncate block w-full text-start flex justify-center">
                {deck.name}
              </span>
            </button>
          ))
        ) : (
          <p className="text-center w-64">No decks are due for review.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
