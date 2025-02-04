import Card from "./components/Card";
import Header from "./components/Header";
import ShowAnswerBtn from "./components/ShowAnswerBtn";
import Sidebar from "./components/Sidebar";
import CardRateBtns from "./components/CardRateBtns";

import { useState } from "react";

function App() {
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked(!showAnswerBtnClicked);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex justify-center gap-10">
        <Sidebar />
        <div className="flex flex-col items-center ">
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
              <ShowAnswerBtn onShowAnswerBtnClick={handleShowAnswerBtnClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
