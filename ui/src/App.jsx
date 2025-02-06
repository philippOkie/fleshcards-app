import Card from "./components/Card";
import Header from "./components/Header";
import ShowAnswerBtn from "./components/ShowAnswerBtn";
import Sidebar from "./components/Sidebar";
import CardRateBtns from "./components/CardRateBtns";
import AddCardComp from "./components/AddCardComp";

import { useState } from "react";

function App() {
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);
  const [createDeckBtnClick, setCreateDeckBtnClick] = useState(false);

  const handleCreateDeckBtnClick = () => {
    setCreateDeckBtnClick(!createDeckBtnClick);
  };

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked(!showAnswerBtnClicked);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        createDeckBtnClicked={handleCreateDeckBtnClick}
        createDeckBtnClick={createDeckBtnClick}
      />
      {createDeckBtnClick ? (
        <div className="flex flex pl-12 gap-18">
          <AddCardComp />
        </div>
      ) : (
        <div className="flex flex pl-12 gap-18">
          <Sidebar />
          <div className="flex flex-col pr-32">
            <Card
              showAnswerBtnClicked={showAnswerBtnClicked}
              props={{
                forwardText: "Hello",
                backText: "Привет",
              }}
            />
            <div className="flex justify-center mt-10">
              {showAnswerBtnClicked ? (
                <CardRateBtns />
              ) : (
                <ShowAnswerBtn
                  onShowAnswerBtnClick={handleShowAnswerBtnClick}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
