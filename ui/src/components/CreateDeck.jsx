import { useDeck } from "./DeckContext";

import AddCardComp from "./AddCardComp";
import CreateDeckFooter from "./CreateDeckFooter";

function CreateDeck() {
  const { unfinishedDeck } = useDeck();

  if (!unfinishedDeck || !unfinishedDeck.cards) {
    return <p>No unfinished deck found or no cards available.</p>;
  }

  return (
    <div className="flex flex-col mt-24">
      <div className="flex flex-col pl-48 pr-48 pb-12 gap-4 overflow-y-auto flex-1">
        {unfinishedDeck.cards.map((card, index) => (
          <AddCardComp
            key={index}
            initialFrontText={card.textForward}
            initialBackText={card.textBack}
          />
        ))}

        <button className="btn btn-primary btn-block">ADD CARD</button>
      </div>

      <CreateDeckFooter />
    </div>
  );
}

export default CreateDeck;
