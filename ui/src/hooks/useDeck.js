import { useContext } from "react";
import { DeckContext } from "../components/DeckContext";

export const useDeck = () => {
  return useContext(DeckContext);
};
