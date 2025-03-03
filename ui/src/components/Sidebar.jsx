import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ decks = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/\/study\/([a-f0-9-]{36})/);
    if (match) {
      setSelectedDeck(match[1]);
    }
  }, [location.pathname]);

  const handleDeckClick = (deckId) => {
    setSelectedDeck(deckId);
    localStorage.setItem("lastChosenDeck", deckId);
    navigate(`/study/${deckId}`);
  };

  const filteredDecks = decks
    .filter((deck) =>
      deck.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.id === selectedDeck ? -1 : b.id === selectedDeck ? 1 : 0
    );

  return (
    <div className="flex flex-col gap-6 w-64">
      <div className="form-control w-full">
        <input
          type="text"
          placeholder="Search by name or topics"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 h-96 overflow-y-auto">
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck) => (
            <button
              key={deck.id}
              className={`btn w-full ${
                deck.id === selectedDeck ? "btn-primary" : "btn-neutral"
              }`}
              onClick={() => handleDeckClick(deck.id)}
            >
              <span className="truncate block w-full text-start flex justify-center">
                {deck.name}
              </span>
            </button>
          ))
        ) : (
          <p className="text-center">No decks found</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
