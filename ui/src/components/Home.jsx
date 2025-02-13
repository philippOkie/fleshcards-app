import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Card from "./Card";
import CardRateBtns from "./CardRateBtns";
import ShowAnswerBtn from "./ShowAnswerBtn";

function Home({ showAnswerBtnClicked, handleShowAnswerBtnClick }) {
  const { deckId, cardId } = useParams();
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track the current card index

  // Fetch all decks
  useEffect(() => {
    const fetchAllDecks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/decks/all", {
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

  // Fetch cards when a deck is selected
  useEffect(() => {
    if (!deckId || !decks.length) return;

    const deck = decks.find((deck) => deck.id === deckId);
    if (deck) {
      setCurrentDeck(deck);

      const fetchDeckCards = async () => {
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
            if (data.cards && data.cards.length > 0) {
              setCards(data.cards); // Store cards in the state
            } else {
              console.log("No cards in this deck");
              setCards([]); // No cards found
            }
          } else {
            console.error(`Error fetching cards: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching deck cards:", error);
        }
      };

      fetchDeckCards();
    }
  }, [deckId, decks]);

  // Handle moving to the next card
  const handleNextCard = () => {
    console.log(`Moved to card index: ${currentCardIndex + 1}`);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1); // Move to the next card
      handleShowAnswerBtnClick(false); // Reset showAnswerBtnClicked to false for next card
    } else {
      console.log("You've finished all the cards.");
    }
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="flex pl-12 gap-18 mt-24">
      <Sidebar decks={decks} />
      <div className="flex flex-col pr-32">
        {currentCard ? (
          <div key={currentCard.id}>
            <Card
              showAnswerBtnClicked={showAnswerBtnClicked}
              props={{
                forwardText: currentCard.textForward,
                backText: currentCard.textBack,
              }}
            />
            <div className="flex justify-center mt-10">
              {showAnswerBtnClicked ? (
                <CardRateBtns onNext={handleNextCard} />
              ) : (
                <ShowAnswerBtn
                  onShowAnswerBtnClick={handleShowAnswerBtnClick}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>No cards available in this deck.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
