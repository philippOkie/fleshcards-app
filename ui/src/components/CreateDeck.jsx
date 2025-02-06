import AddCardComp from "./AddCardComp";

function CreateDeck() {
  return (
    <div>
      <div className="flex flex-col pl-48 pr-48 pb-12 gap-4 overflow-y-auto">
        <AddCardComp />
        <button className="btn btn-primary btn-block">ADD CARD</button>
      </div>
    </div>
  );
}

export default CreateDeck;
