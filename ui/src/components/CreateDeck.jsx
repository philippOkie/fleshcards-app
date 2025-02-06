import AddCardComp from "./AddCardComp";
import CreateDeckFooter from "./CreateDeckFooter";

function CreateDeck() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col pl-48 pr-48 pb-32 gap-4 overflow-y-auto flex-1">
        <AddCardComp />

        <button className="btn btn-primary btn-block">ADD CARD</button>
      </div>

      <CreateDeckFooter />
    </div>
  );
}

export default CreateDeck;
