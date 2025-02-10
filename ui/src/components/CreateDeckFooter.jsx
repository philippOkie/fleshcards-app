import { useState, useEffect } from "react";

function CreateDeckFooter({
  deckName,
  setDeckName,
  deckTopics,
  setDeckTopics,
  cards,
  setFinishedDeck,
}) {
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    if (cards.length > 0) {
      setIsSaveEnabled(true);
    } else {
      setIsSaveEnabled(false);
    }
  }, [cards]);

  const handleSaveClick = async () => {
    if (isSaveEnabled) {
      setFinishedDeck();

      console.log("Deck is marked as finished!");
    } else {
      console.error("Cannot finish deck: There must be at least one card.");
    }
  };

  return (
    <footer className="flex flex-row justify-between bg-base-100 text-center p-6 pl-12 pr-12 w-full">
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Type your deck name here!"
          className="input w-full max-w-xs"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />

        <input
          type="text"
          style={{ width: "600px" }}
          placeholder='You can add topics here "@anatomy @english_spanish"'
          className="input w-full max-w-lg"
          value={deckTopics}
          onChange={(e) => setDeckTopics(e.target.value)}
        />
      </div>

      <button
        className="btn btn-lg fixed btn-success bottom-6 right-12"
        disabled={!isSaveEnabled}
        onClick={handleSaveClick}
      >
        Save
      </button>
    </footer>
  );
}

export default CreateDeckFooter;
