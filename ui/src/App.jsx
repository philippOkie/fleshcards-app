import Header from "./components/Header";
import Home from "./components/Home";
import CreateDeck from "./components/CreateDeck";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked((prev) => !prev);
  };

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Header />
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
