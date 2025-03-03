import { useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";

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
  targetLanguage,
  setTargetLanguage,
  nativeLanguage,
  setNativeLanguage,
}) {
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [currentDeckName, setCurrentDeckName] = useState(deckName);
  const [currentDeckTopics, setCurrentDeckTopics] = useState(deckTopics);

  useEffect(() => {
    if (unfinishedDeck?.targetLanguage) {
      setTargetLanguage(unfinishedDeck.targetLanguage);
    }
    if (unfinishedDeck?.nativeLanguage) {
      setNativeLanguage(unfinishedDeck.nativeLanguage);
    }
  }, [unfinishedDeck]);

  useEffect(() => {
    const allCardsFilled = cards.every(
      (card) =>
        (card.textForward || "").trim() !== "" &&
        (card.textBack || "").trim() !== ""
    );
    setIsSaveEnabled(cards.length > 0 && allCardsFilled);
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
    if (unfinishedDeck?.targetLanguage) {
      setTargetLanguage(unfinishedDeck.targetLanguage);
    }
    if (unfinishedDeck?.nativeLanguage) {
      setNativeLanguage(unfinishedDeck.nativeLanguage);
    }
  }, [unfinishedDeck]);

  useEffect(() => {
    localStorage.setItem("deckName", deckName);
  }, [deckName]);

  useEffect(() => {
    localStorage.setItem("deckTopics", JSON.stringify(deckTopics));
  }, [deckTopics]);

  useEffect(() => {
    localStorage.setItem("targetLanguage", targetLanguage);
  }, [targetLanguage]);

  useEffect(() => {
    localStorage.setItem("nativeLanguage", nativeLanguage);
  }, [nativeLanguage]);

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

  return (
    <footer className="flex flex-row justify-between fixed bottom-0 right-0 bg-base-100 text-center pt-4 pb-2 pl-12 pr-12 w-full">
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Type your deck name here!"
          className="input w-full max-w-xs"
          value={currentDeckName}
          onChange={(e) => setCurrentDeckName(e.target.value)}
          onBlur={() => {
            if (currentDeckName !== deckName) {
              setDeckName(currentDeckName);
              updateDeck("name", currentDeckName);
            }
          }}
        />

        <input
          type="text"
          placeholder='Categorize the deck "english"'
          className="input w-full max-w-lg"
          value={currentDeckTopics.join(", ")}
          onChange={(e) =>
            setCurrentDeckTopics(
              e.target.value
                .split(",")
                .map((topic) => topic.trim())
                .filter((topic) => topic !== "")
            )
          }
          onBlur={() => {
            if (
              JSON.stringify(currentDeckTopics) !== JSON.stringify(deckTopics)
            ) {
              setDeckTopics(currentDeckTopics);
              updateDeck("topics", currentDeckTopics);
            }
          }}
        />

        <LanguageSelector
          label="Native Language"
          value={targetLanguage}
          onChange={setTargetLanguage}
        />

        <LanguageSelector
          label="Target Language"
          value={nativeLanguage}
          onChange={setNativeLanguage}
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
