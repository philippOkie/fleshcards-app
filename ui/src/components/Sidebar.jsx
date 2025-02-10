import { useState, useEffect } from "react";

function Sidebar() {
  const [decks, setDecks] = useState([]);

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
        {decks.map((deck) => (
          <button
            key={deck.id}
            className="btn btn-neutral"
            onClick={() => fetchDeckCards(deck.id)}
          >
            {deck.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
