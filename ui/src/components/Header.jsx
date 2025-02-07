import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unfinishedDeck, setUnfinishedDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = "b71c5377-7373-491f-9c2d-9a13dfb7b84f";

  const inCreateDeck = location.pathname === "/create-deck";

  useEffect(() => {
    const fetchUnfinishedDeck = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/decks/get-unfinished-deck?userId=${userId}`
        );

        if (!response.ok) {
          const responseText = await response.text();
          console.error(`Error: ${response.status} - ${responseText}`);
          return;
        }

        const data = await response.json();

        if (data && data.id) {
          setUnfinishedDeck(data);
        }
      } catch (error) {
        console.error("Error fetching unfinished deck:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnfinishedDeck();
  }, []);

  const handlePlusClick = () => {
    if (inCreateDeck) {
      navigate("/");
    } else {
      if (unfinishedDeck) {
        navigate(`deck/${unfinishedDeck.id}`);
      } else {
        navigate("/create-deck");
      }
    }
  };

  return (
    <div className="navbar bg-base-100 mb-10 mt-2">
      <div className="navbar-start flex gap-2 items-center pl-10">
        <div className="text-4xl w-[120px]">Spacer</div>
        <a className="btn btn-neutral w-32 !text-xl">Decks</a>
        <a
          className="btn btn-accent w-16 !text-2xl cursor-pointer"
          onClick={handlePlusClick}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : inCreateDeck ? (
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
        </a>
      </div>

      <div className="navbar-end pr-10">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle avatar">
            <div className="w-24 rounded-full"></div>
          </div>
          <ul
            tabIndex={0}
            className="menu bg-neutral menu-sm dropdown-content bg-base-500 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Change Avatar</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
