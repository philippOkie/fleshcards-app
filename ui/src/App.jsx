import Header from "./components/Header";
import Home from "./components/Home";
import CreateDeck from "./components/CreateDeck";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [createDeckBtnClick, setCreateDeckBtnClick] = useState(false);
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);

  const handleCreateDeckBtnClick = () => {
    setCreateDeckBtnClick((prev) => !prev);
  };

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked((prev) => !prev);
  };

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Header
          createDeckBtnClicked={handleCreateDeckBtnClick}
          createDeckBtnClick={createDeckBtnClick}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                showAnswerBtnClicked={showAnswerBtnClicked}
                handleShowAnswerBtnClick={handleShowAnswerBtnClick}
              />
            }
          />

          <Route path="/create-deck" element={<CreateDeck />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
