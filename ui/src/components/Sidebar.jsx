import { useState, useEffect } from "react";

function Sidebar() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const fetchUnfinishedDeck = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/decks/all`);

        if (response.ok) {
          const data = await response.json();

          setDecks(data);
        } else {
          console.error(`Error: ${response.status} - ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error fetching unfinished deck:", error);
      }
    };

    fetchUnfinishedDeck();
  }, []);

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
        {decks.map((deck, index) => (
          <button key={index} className="btn btn-neutral">
            {deck.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
