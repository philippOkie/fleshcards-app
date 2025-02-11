import AddCardComp from "./AddCardComp";
import CreateDeckFooter from "./CreateDeckFooter";

import { useState, useEffect } from "react";

import { useDeck } from "./DeckContext";

function CreateDeck() {
  const { unfinishedDeck } = useDeck();
  const [cards, setCards] = useState([]);
  const token = localStorage.getItem("token");

  const [deckName, setDeckName] = useState(
    () => localStorage.getItem("deckName") || unfinishedDeck?.name || ""
  );

  const [deckTopics, setDeckTopics] = useState(() => {
    const storedTopics = localStorage.getItem("deckTopics");
    return storedTopics
      ? JSON.parse(storedTopics)
      : unfinishedDeck?.topics || [];
  });

  useEffect(() => {
    const fetchCards = async () => {
      if (!unfinishedDeck?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/decks/deck/${unfinishedDeck.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch cards");

        const data = await response.json();
        setCards(data.cards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [unfinishedDeck?.id, token]);

  useEffect(() => {
    localStorage.setItem("deckName", deckName);
  }, [deckName]);

  useEffect(() => {
    localStorage.setItem("deckTopics", JSON.stringify(deckTopics));
  }, [deckTopics]);

  const handleAddCard = async () => {
    if (!token || !unfinishedDeck?.id) {
      console.error("Missing token or deckId");
      return;
    }

    const cardDetails = {
      deckId: unfinishedDeck.id,
      textForward: "Type your text here! (Front side)",
      textBack: "Type your text here! (Back side)",
    };

    try {
      const response = await fetch("http://localhost:3000/api/cards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cardDetails),
      });

      if (!response.ok) throw new Error("Failed to add card");

      const data = await response.json();
      setCards((prevCards) => [...prevCards, data.card]);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleDeleteCard = async (cardIdToDelete) => {
    const token = localStorage.getItem("token");

    if (!token || !unfinishedDeck?.id) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cards/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deckId: unfinishedDeck.id,
          cardId: cardIdToDelete,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== cardIdToDelete)
      );
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const markDeckAsFinished = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/decks/set-finished-deck/${unfinishedDeck.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Deck marked as finished successfully");
      } else {
        console.error("Failed to mark deck as finished");
      }
    } catch (error) {
      console.error("Error marking deck as finished:", error);
    }
  };

  return (
    <div className="flex flex-col mt-24">
      <div className="flex flex-col pl-48 pr-48 pb-12 gap-4 overflow-y-auto flex-1">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <AddCardComp
              key={index}
              initialFrontText={card.textForward}
              initialBackText={card.textBack}
              onDelete={() => handleDeleteCard(card.id)}
            />
          ))
        ) : (
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No cards added yet.</span>
          </div>
        )}

        <button className="btn btn-primary btn-block" onClick={handleAddCard}>
          ADD CARD
        </button>
      </div>

      <CreateDeckFooter
        deckName={deckName}
        setDeckName={setDeckName}
        deckTopics={deckTopics}
        setDeckTopics={setDeckTopics}
        setFinishedDeck={markDeckAsFinished}
        cards={cards}
      />
    </div>
  );
}

export default CreateDeck;
