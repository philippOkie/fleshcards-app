import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

      if (currentIndex < cards.length - 1) {
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
      <Sidebar
        decks={filteredDecks}
        selectedDeck={selectedDeck}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDeckClick={handleDeckClick}
      />

      <div className="flex flex-col pr-32">
        {isLoading ? (
          <div className="skeleton h-[500px] w-full bg-base-200 animate-pulse rounded-box"></div>
        ) : currentCard ? (
          <div key={`card-${currentIndex}`}>
            <Card
              showAnswerBtnClicked={showAnswerBtnClicked}
              forwardText={currentCard.textForward}
              backText={currentCard.textBack}
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
              <div className="card bg-base-100 rounded-box grid h-80 place-items-center text-5xl">
                Hello!
              </div>
              <div className="divider"></div>
              <div className="card rounded-box grid h-80 place-items-center text-5xl">
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
