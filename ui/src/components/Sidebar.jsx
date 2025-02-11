import { useState, useEffect } from "react";

function Sidebar() {
  const [decks, setDecks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllDecks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/api/decks/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(data);
        } else {
          console.error(`Error: ${response.status} - ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchAllDecks();
  }, []);

  const fetchDeckCards = async (deckId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/decks/deck/${deckId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching deck cards:", error);
    }
  };

  const filteredDecks = decks.filter((deck) => {
    return deck.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="form-control pr-4">
        <input
          type="text"
          placeholder="Search by name"
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
              onClick={() => fetchDeckCards(deck.id)}
            >
              {deck.name}
            </button>
          ))
        ) : (
          <p>No matching decks found</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
