import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import Card from "./Card";
import CardRateBtns from "./CardRateBtns";
import ShowAnswerBtn from "./ShowAnswerBtn";

function Home({
  showAnswerBtnClicked,
  handleShowAnswerBtnClick,
  resetShowAnswerBtn,
}) {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const { deckId, cardId } = useParams();

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
          console.error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchAllDecks();
  }, []);

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
              setCards(data.cards);
            } else {
              setCards([]);
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

  const currentCard = cards[currentIndex];

  const handleRateCard = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/cards/rate/${currentCard.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        }
      );
      if (response.ok) {
        handleNextCard();
      } else {
        console.error("Error rating card:", response.status);
      }
    } catch (error) {
      console.error("Error rating card:", error);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleShowAnswerBtnClick(false);
    }
  };

  return (
    <div className="flex pl-12 gap-18 mt-24">
      <Sidebar decks={decks} resetShowAnswerBtn={resetShowAnswerBtn} />
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
                <CardRateBtns onRate={handleRateCard} />
              ) : (
                <ShowAnswerBtn
                  onShowAnswerBtnClick={handleShowAnswerBtnClick}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="card bg-neutral text-neutral-content w-290 p-4">
            <div className="flex w-full flex-col border-opacity-50">
              <div className="card bg-base-100 rounded-box grid h-80 place-items-center flex justify-center text-5xl">
                Hello!
              </div>

              <div className="divider"></div>

              <div className="card rounded-box grid h-80 place-items-center flex justify-center text-5xl">
                <span>Please, choose a deck to start!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
