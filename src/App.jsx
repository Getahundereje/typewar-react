import SignUp from "./pages/sign-up/sign-up.page";
import SignIn from "./pages/sign-in/sign-in.page";
import GamePage from "./pages/game/game.page";

import { WordsProvider } from "./contexts/words/words.context";
import { BulletsProvider } from "./contexts/bullets/bullets.context";

import "./App.css";

function App() {
  return (
    <BulletsProvider>
      <WordsProvider>
        <GamePage />
      </WordsProvider>
    </BulletsProvider>
  );
}

export default App;
