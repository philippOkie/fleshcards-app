import AddCardComp from "./AddCardComp";
import CreateDeckFooter from "./CreateDeckFooter";

import { useState, useEffect } from "react";
import { useDeck } from "./DeckContext";

function CreateDeck() {
  const { unfinishedDeck } = useDeck();

  const [deckName, setDeckName] = useState(() => {
    return localStorage.getItem("deckName") || unfinishedDeck?.name || "";
  });

  const [deckTopics, setDeckTopics] = useState(() => {
    const storedTopics = localStorage.getItem("deckTopics");
    return storedTopics
      ? JSON.parse(storedTopics)
      : unfinishedDeck?.topics || [];
  });

  useEffect(() => {
    localStorage.setItem("deckName", deckName);
  }, [deckName]);

  useEffect(() => {
    localStorage.setItem("deckTopics", JSON.stringify(deckTopics));
  }, [deckTopics]);

  if (!unfinishedDeck || !unfinishedDeck.cards) {
    return <p>No unfinished deck found or no cards available.</p>;
  }

  return (
    <div className="flex flex-col mt-24">
      <div className="flex flex-col pl-48 pr-48 pb-12 gap-4 overflow-y-auto flex-1">
        {unfinishedDeck.cards.map((card, index) => (
          <AddCardComp
            key={index}
            initialFrontText={card.textForward}
            initialBackText={card.textBack}
          />
        ))}

        <button className="btn btn-primary btn-block">ADD CARD</button>
      </div>

      <CreateDeckFooter
        deckName={deckName}
        setDeckName={setDeckName}
        deckTopics={deckTopics}
        setDeckTopics={setDeckTopics}
      />
    </div>
  );
}

export default CreateDeck;
