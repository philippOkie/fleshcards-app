import { createContext, useState, useContext, useEffect } from "react";

const DeckContext = createContext();

export const useDeck = () => {
  return useContext(DeckContext);
};

export const DeckProvider = ({ children }) => {
  const [unfinishedDeck, setUnfinishedDeck] = useState(null);

  useEffect(() => {
    const fetchUnfinishedDeck = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Error: No token found");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/decks/get-unfinished-deck`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data.id) {
            setUnfinishedDeck(data);
          } else {
            setUnfinishedDeck(null);
          }
        } else {
          console.error(`Error: ${response.status} - ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error fetching unfinished deck:", error);
      }
    };

    fetchUnfinishedDeck();
  }, []);

  return (
    <DeckContext.Provider value={{ unfinishedDeck, setUnfinishedDeck }}>
      {children}
    </DeckContext.Provider>
  );
};
