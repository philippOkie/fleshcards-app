import Home from "./components/Home";
import CreateDeck from "./components/CreateDeck";
import Header from "./components/Header";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import { DeckProvider } from "./components/DeckContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <DeckProvider>
        <div className="flex flex-col">
          {isAuthenticated && <Header />}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home
                    showAnswerBtnClicked={showAnswerBtnClicked}
                    handleShowAnswerBtnClick={handleShowAnswerBtnClick}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deck/:id"
              element={
                <ProtectedRoute>
                  <CreateDeck />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </DeckProvider>
    </Router>
  );
}

export default App;
