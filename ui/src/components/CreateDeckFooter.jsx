import { useState, useEffect } from "react";

function CreateDeckFooter({
  deckName,
  setDeckName,
  deckTopics,
  setDeckTopics,
  cards,
  setFinishedDeck,
  handleAddCard,
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
    <footer className="flex flex-row justify-between fixed bottom-0 right-0 bg-base-100 text-center pt-4 pb-2 pl-12 pr-12 w-full">
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
          placeholder='Add topics to categorize your deck (e.g. @math, @history)"'
          className="input w-full max-w-lg"
          value={deckTopics}
          onChange={(e) => setDeckTopics(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button className="btn btn-lg btn-primary" onClick={handleAddCard}>
          Add Card
        </button>

        <button
          className="btn btn-lg btn-success"
          disabled={!isSaveEnabled}
          onClick={handleSaveClick}
        >
          Save
        </button>
      </div>
    </footer>
  );
}

export default CreateDeckFooter;
