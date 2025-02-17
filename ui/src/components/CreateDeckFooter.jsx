import { useState, useEffect } from "react";

function CreateDeckFooter({
  deckName,
  setDeckName,
  deckTopics,
  setDeckTopics,
  cards,
  setFinishedDeck,
  handleAddCard,
  unfinishedDeck,
  token,
}) {
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [currentDeckName, setCurrentDeckName] = useState(deckName);
  const [currentDeckTopics, setCurrentDeckTopics] = useState(deckTopics);

  useEffect(() => {
    setIsSaveEnabled(cards.length > 0);
  }, [cards]);

  useEffect(() => {
    if (unfinishedDeck?.name) {
      setDeckName(unfinishedDeck.name);
      setCurrentDeckName(unfinishedDeck.name);
    }
    if (unfinishedDeck?.topics) {
      setDeckTopics(unfinishedDeck.topics);
      setCurrentDeckTopics(unfinishedDeck.topics);
    }
  }, [unfinishedDeck]);

  useEffect(() => {
    localStorage.setItem("deckName", deckName);
  }, [deckName]);

  useEffect(() => {
    localStorage.setItem("deckTopics", JSON.stringify(deckTopics));
  }, [deckTopics]);

  const updateDeck = async (field, value) => {
    if (!unfinishedDeck?.id) return;
    try {
      await fetch(
        `http://localhost:3000/api/decks/update/${unfinishedDeck.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const handleNameChange = (e) => {
    setCurrentDeckName(e.target.value);
  };

  const handleNameBlur = () => {
    if (currentDeckName !== deckName) {
      setDeckName(currentDeckName);
      updateDeck("name", currentDeckName);
    }
  };

  const handleTopicsChange = (e) => {
    const topicsArray = e.target.value
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic !== "");
    setCurrentDeckTopics(topicsArray);
  };

  const handleTopicsBlur = () => {
    if (JSON.stringify(currentDeckTopics) !== JSON.stringify(deckTopics)) {
      setDeckTopics(currentDeckTopics);
      updateDeck("topics", currentDeckTopics);
    }
  };

  return (
    <footer className="flex flex-row justify-between fixed bottom-0 right-0 bg-base-100 text-center pt-4 pb-2 pl-12 pr-12 w-full">
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Type your deck name here!"
          className="input w-full max-w-xs"
          value={currentDeckName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />

        <input
          type="text"
          style={{ width: "600px" }}
          placeholder='Categorize your deck "math, english_spanish"'
          className="input w-full max-w-lg"
          value={currentDeckTopics.join(", ")}
          onChange={handleTopicsChange}
          onBlur={handleTopicsBlur}
        />
      </div>

      <div className="flex gap-4">
        <button className="btn btn-lg btn-primary" onClick={handleAddCard}>
          Add Card
        </button>

        <button
          className="btn btn-lg btn-success"
          disabled={!isSaveEnabled}
          onClick={setFinishedDeck}
        >
          Save
        </button>
      </div>
    </footer>
  );
}

export default CreateDeckFooter;
