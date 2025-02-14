import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ decks }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleDeckClick = (deckId) => {
    navigate(`/study/${deckId}`);
  };

  const filteredDecks = decks.filter((deck) => {
    return deck.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="form-control pr-4">
        <input
          type="text"
          placeholder="Search by name or topics"
          className="input input-bordered w-24 md:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 h-162 overflow-y-auto border pr-4">
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck) => (
            <button
              key={deck.id}
              className="btn btn-neutral"
              onClick={() => handleDeckClick(deck.id)}
            >
              {deck.name}
            </button>
          ))
        ) : (
          <p>No decks found</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
