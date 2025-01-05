import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./pages/sign-in-up/sign-up/sign-up.page";
import SignIn from "./pages/sign-in-up/sign-in/sign-in.page";
import GameHomepage from "./pages/game/homepage/homepage.page";
import GamePage from "./pages/game/game.page";

import { WordsProvider } from "./contexts/words/words.context";
import { BulletsProvider } from "./contexts/bullets/bullets.context";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <BulletsProvider>
        <WordsProvider>
          <Routes>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="game" element={<GameHomepage />} />
            <Route path="gamePage" element={<GamePage />} />
          </Routes>
        </WordsProvider>
      </BulletsProvider>
    </BrowserRouter>
  );
}

export default App;
