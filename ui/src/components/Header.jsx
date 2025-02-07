import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "./Avatar";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unfinishedDeck, setUnfinishedDeck] = useState(null);

  const userId = "a4ec2f47-dfaa-44cc-8124-2ce595a7d562";
  const isDeckPage = location.pathname.startsWith("/deck/");

  useEffect(() => {
    const fetchUnfinishedDeck = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/decks/get-unfinished-deck?userId=${userId}`
        );

        if (response.ok) {
          const data = await response.json();
          setUnfinishedDeck(data.id ? data : null);
        } else {
          console.error(`Error: ${response.status} - ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error fetching unfinished deck:", error);
      }
    };

    fetchUnfinishedDeck();
  }, [userId]);

  const handlePlusClick = () => {
    if (isDeckPage) {
      navigate("/");
    } else {
      const deckId = unfinishedDeck?.id;
      navigate(deckId ? `/deck/${deckId}` : "/");
    }
  };

  return (
    <div className="navbar bg-base-100 mb-10 mt-2">
      <div className="navbar-start flex gap-2 items-center pl-10">
        <div className="text-4xl w-[120px]">Spacer</div>
        <button className="btn btn-neutral w-32 !text-xl">Decks</button>
        <button
          className="btn btn-accent w-16 !text-2xl cursor-pointer"
          onClick={handlePlusClick}
        >
          {isDeckPage ? (
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
        <Avatar />
      </div>
    </div>
  );
}

export default Header;
