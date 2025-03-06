import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowSize();
  const [deckCompleted, setDeckCompleted] = useState(false);
  const { deckId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAllDecks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/decks/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(data);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDecks();
  }, []);

  useEffect(() => {
    const match = location.pathname.match(/\/study\/([a-f0-9-]{36})/);
    if (match) setSelectedDeck(match[1]);
  }, [location.pathname]);

  useEffect(() => {
    if (!deckId || !decks.length) return;

    const fetchDeckCards = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/decks/deck/${deckId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentDeck(decks.find((deck) => deck.id === deckId));
          setCards(data.cards || []);
          setDeckCompleted(false);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeckCards();
  }, [deckId, decks, resetShowAnswerBtn]);

  useEffect(() => {
    const lastChosenDeck = localStorage.getItem("lastChosenDeck");

    if (lastChosenDeck) {
      setIsLoading(true);
      setSelectedDeck(localStorage.getItem("lastChosenDeck"));
      navigate(`/study/${lastChosenDeck}`);
    }
  }, []);

  const handleDeckClick = (deckId) => {
    if (deckId === localStorage.getItem("lastChosenDeck")) return;

    setIsLoading(true);
    setSelectedDeck(deckId);
    localStorage.setItem("lastChosenDeck", deckId);
    navigate(`/study/${deckId}`);
    resetShowAnswerBtn();
  };

  const handleRateCard = async (rating) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:3000/api/cards/rate/${cards[currentIndex].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (currentIndex === cards.length - 1) {
        setDeckCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        handleShowAnswerBtnClick(false);
      }
    } catch (error) {
      console.error("Error rating card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDecks = decks
    .filter((deck) =>
      deck.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.id === selectedDeck ? -1 : b.id === selectedDeck ? 1 : 0
    );

  const currentCard = cards[currentIndex];

  return (
    <div className="flex pl-12 gap-18 mt-24">
      {deckCompleted && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      <Sidebar
        decks={filteredDecks}
        selectedDeck={selectedDeck}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDeckClick={handleDeckClick}
      />

      <div className="flex flex-col pr-32 justify-center items-center w-full">
        {" "}
        {isLoading ? (
          <div className="skeleton h-[500px] w-full bg-transparent animate-pulse rounded-box"></div>
        ) : deckCompleted ? (
          <div className="text-center animate-fade-in">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="text-4xl font-bold mb-4">Deck Mastered!</h2>
            <p className="text-xl text-gray-600">
              You&quot;ve successfully reviewed all cards in{" "}
              <span className="font-semibold text-primary">
                {currentDeck?.name}.
              </span>{" "}
              Now choose another deck!
            </p>
          </div>
        ) : currentCard ? (
          <div key={`card-${currentIndex}`}>
            <Card
              showAnswerBtnClicked={showAnswerBtnClicked}
              forwardText={currentCard.textForward}
              backText={currentCard.textBack}
              imgBack={currentCard.imageUrlBack}
              imgForward={currentCard.imageUrlForward}
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
          <div className="card bg-transparent text-neutral-content w-290 p-4">
            <div className="flex w-full flex-col border-opacity-50">
              <div className="card bg-base-100 rounded-box grid h-80 place-items-center text-5xl">
                Choose or create a deck to get started!
              </div>
              <div className="divider"></div>
              <div className="card rounded-box grid h-80 place-items-center text-5xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
