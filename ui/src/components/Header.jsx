import { useLocation, useNavigate } from "react-router-dom";
import { useDeck } from "./DeckContext";
import Avatar from "./Avatar";

function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { unfinishedDeck, setUnfinishedDeck } = useDeck();
  const isOnDeckPage = location.pathname.startsWith("/deck/");

  const handleCreateOrNavigateDeck = async () => {
    const token = localStorage.getItem("token");

    if (isOnDeckPage) {
      const savedDeck = localStorage.getItem("lastChosenDeck");

      if (savedDeck) {
        navigate(`/study/${savedDeck}`);
      } else {
        navigate("/");
      }
      return;
    }

    if (unfinishedDeck) {
      navigate(`/deck/${unfinishedDeck.id}`);
      return;
    }

    try {
      const deckResponse = await fetch(
        "http://localhost:3000/api/decks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: "New Deck" }),
        }
      );

      const deckResult = await deckResponse.json();

      if (deckResult.deckId) {
        setUnfinishedDeck({
          id: deckResult.deckId,
          name: "New Deck",
          topics: [],
        });

        const cardResponse = await fetch(
          "http://localhost:3000/api/cards/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              deckId: deckResult.deckId,
              content: "New Card",
            }),
          }
        );

        const cardResult = await cardResponse.json();

        if (cardResult.cardId) {
          console.log("Card created successfully:", cardResult);
        } else {
          console.error("Failed to create card:", cardResult.message);
        }

        navigate(`/deck/${deckResult.deckId}`);
      } else {
        console.error("Failed to create deck:", deckResult.message);
      }
    } catch (error) {
      console.error("Error creating deck and card:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 fixed z-10">
      <div className="navbar-start flex gap-2 items-center mb-2 mt-2 pl-10">
        <div className="text-4xl w-[120px]">Spacer</div>

        <button
          className="btn btn-accent w-16 !text-2xl cursor-pointer"
          onClick={handleCreateOrNavigateDeck}
        >
          {isOnDeckPage ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
              <g
                fill="none"
                fillRule="evenodd"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(2 3)"
              >
                <path d="m5.5.5h6c1.10457 0 2 .89543 2 2v10c0 1.10457-.89543 2-2 2h-6c-1.10457 0-2-.89543-2-2v-10c0-1.10457.89543-2 2-2zm8 2.5h1c1.10457 0 2 .89543 2 2v5c0 1.10457-.89543 2-2 2h-1z" />
                <path
                  d="m.5 3h1c1.10457 0 2 .89543 2 2v5c0 1.10457-.89543 2-2 2h-1z"
                  transform="matrix(-1 0 0 1 4 0)"
                />
              </g>
            </svg>
          ) : (
            "+"
          )}
        </button>
      </div>

      <div className="navbar-end pr-10">
        <Avatar onLogout={onLogout} />
      </div>
    </div>
  );
}

export default Header;
