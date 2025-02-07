import { createContext, useState, useContext, useEffect } from "react";

const DeckContext = createContext();

export const useDeck = () => {
  return useContext(DeckContext);
};

export const DeckProvider = ({ children }) => {
  const [unfinishedDeck, setUnfinishedDeck] = useState(null);

  const userId = "a4ec2f47-dfaa-44cc-8124-2ce595a7d562";

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

  return (
    <DeckContext.Provider value={{ unfinishedDeck, setUnfinishedDeck }}>
      {children}
    </DeckContext.Provider>
  );
};
