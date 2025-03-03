import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./components/Home";
import CreateDeck from "./components/CreateDeck";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";

import { DeckProvider } from "./components/DeckContext";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [showAnswerBtnClicked, setShowAnswerBtnClicked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleShowAnswerBtnClick = () => {
    setShowAnswerBtnClicked((prev) => !prev);
  };

  const resetShowAnswerBtn = () => {
    setShowAnswerBtnClicked(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <DeckProvider>
        <div className="flex flex-col">
          {isAuthenticated && <Header onLogout={handleLogout} />}
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
              path="/study/:deckId"
              element={
                <ProtectedRoute>
                  <Home
                    showAnswerBtnClicked={showAnswerBtnClicked}
                    handleShowAnswerBtnClick={handleShowAnswerBtnClick}
                    resetShowAnswerBtn={resetShowAnswerBtn}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
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
