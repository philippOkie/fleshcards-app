import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeck } from "../hooks/useDeck";

import AddCardComp from "./AddCardComp";
import CreateDeckFooter from "./CreateDeckFooter";

function CreateDeck() {
  const { unfinishedDeck, setUnfinishedDeck } = useDeck();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const authToken = localStorage.getItem("token");

  const [deckCards, setDeckCards] = useState([]);
  const [deckTitle, setDeckTitle] = useState(
    () => unfinishedDeck?.name || localStorage.getItem("deckName") || ""
  );
  const [deckCategories, setDeckCategories] = useState(() => {
    const storedCategories = localStorage.getItem("deckTopics");
    return storedCategories
      ? JSON.parse(storedCategories)
      : unfinishedDeck?.topics || [];
  });
  const [targetLanguage, setTargetLanguage] = useState(
    localStorage.getItem("targetLanguage") || ""
  );
  const [nativeLanguage, setNativeLanguage] = useState(
    localStorage.getItem("nativeLanguage") || ""
  );

  useEffect(() => {
    if (unfinishedDeck?.name) setDeckTitle(unfinishedDeck.name);
    if (unfinishedDeck?.topics) setDeckCategories(unfinishedDeck.topics);
  }, [unfinishedDeck]);

  useEffect(() => {
    localStorage.setItem("deckName", deckTitle);
  }, [deckTitle]);

  useEffect(() => {
    localStorage.setItem("deckTopics", JSON.stringify(deckCategories));
  }, [deckCategories]);

  useEffect(() => {
    localStorage.setItem("targetLanguage", targetLanguage);
  }, [targetLanguage]);

  useEffect(() => {
    localStorage.setItem("nativeLanguage", nativeLanguage);
  }, [nativeLanguage]);

  const updateDeckInfo = useCallback(
    async (field, value) => {
      if (!unfinishedDeck?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/decks/update/${unfinishedDeck.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ [field]: value }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update deck ${field}`);
        }
      } catch (error) {
        console.error("Error updating deck:", error);
      }
    },
    [unfinishedDeck?.id, authToken]
  );

  useEffect(() => {
    const loadDeckCards = async () => {
      if (!unfinishedDeck?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/decks/deck/${unfinishedDeck.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch cards");

        const data = await response.json();
        setDeckCards(data.cards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    loadDeckCards();
  }, [unfinishedDeck?.id, authToken]);

  const handleTitleChange = useCallback(
    (newTitle) => {
      setDeckTitle(newTitle);
      updateDeckInfo("name", newTitle);
    },
    [updateDeckInfo]
  );

  const handleCategoriesChange = useCallback(
    (newCategories) => {
      setDeckCategories(newCategories);
      updateDeckInfo("topics", newCategories);
    },
    [updateDeckInfo]
  );

  const addCard = useCallback(async () => {
    if (!authToken || !unfinishedDeck?.id) {
      console.error("Missing token or deckId");
      return;
    }

    const newCard = {
      deckId: unfinishedDeck.id,
      textForward: "",
      textBack: "",
    };

    try {
      const response = await fetch("http://localhost:3000/api/cards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error("Failed to add card");

      const data = await response.json();
      setDeckCards((prevCards) => [...prevCards, data.card]);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  }, [authToken, unfinishedDeck?.id]);

  const deleteCard = useCallback(
    async (cardId) => {
      if (!authToken || !unfinishedDeck?.id) return;

      try {
        const response = await fetch("http://localhost:3000/api/cards/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            deckId: unfinishedDeck.id,
            cardId: cardId,
          }),
        });

        if (!response.ok) throw new Error("Failed to delete card");

        setDeckCards((prevCards) =>
          prevCards.filter((card) => card.id !== cardId)
        );
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    },
    [authToken, unfinishedDeck?.id]
  );

  const handleSaveCardText = useCallback(
    async (cardId, field, value) => {
      const numericCardId = Number(cardId);
      if (isNaN(numericCardId)) {
        throw new Error("Invalid card ID");
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/cards/update/${numericCardId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              deckId: unfinishedDeck?.id,
              [field]: value,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const updatedCard = await response.json();

        setDeckCards((prevCards) =>
          prevCards.map((card) =>
            card.id === numericCardId ? { ...card, [field]: value } : card
          )
        );

        return updatedCard;
      } catch (error) {
        console.error("Error updating card:", error);
        throw error;
      }
    },
    [authToken, unfinishedDeck?.id]
  );

  const finishDeck = useCallback(async () => {
    if (!unfinishedDeck?.id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/decks/set-finished-deck/${unfinishedDeck.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setUnfinishedDeck(null);
      navigate("/");
    } catch (error) {
      console.error("Error marking deck as finished:", error);
    }
  }, [unfinishedDeck?.id, authToken, setUnfinishedDeck, navigate]);

  return (
    <div className="flex flex-col mt-24">
      <div className="flex flex-col pl-48 pr-48 pb-64 gap-4 overflow-y-auto flex-1">
        {deckCards.length > 0 ? (
          deckCards.map((card, index) => (
            <AddCardComp
              key={card.id}
              cardId={card.id}
              deckId={unfinishedDeck?.id}
              initialFrontText={card.textForward}
              initialBackText={card.textBack}
              onDelete={() => deleteCard(card.id)}
              number={index + 1}
              onSave={handleSaveCardText}
              initialImageUrlForward={card.imageUrlForward}
              initialImageUrlBack={card.imageUrlBack}
              targetLanguage={targetLanguage}
              nativeLanguage={nativeLanguage}
            />
          ))
        ) : (
          <div role="alert" className="alert">
            <span>No cards added yet.</span>
          </div>
        )}
      </div>

      <CreateDeckFooter
        deckName={deckTitle}
        setDeckName={handleTitleChange}
        deckTopics={deckCategories}
        setDeckTopics={handleCategoriesChange}
        setFinishedDeck={finishDeck}
        cards={deckCards}
        handleAddCard={addCard}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        nativeLanguage={nativeLanguage}
        setNativeLanguage={setNativeLanguage}
      />

      <div ref={bottomRef}></div>
    </div>
  );
}

export default CreateDeck;
