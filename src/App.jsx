import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./pages/sign-in-up/sign-up/sign-up.page";
import SignIn from "./pages/sign-in-up/sign-in/sign-in.page";
import GameHomepage from "./pages/game/homepage/homepage.page";
import GamePage from "./pages/game/game-page/game-page.page";
import SettingsPage from "./pages/game/settings/settings.page";
import StatsPage from "./pages/game/game-stats/game-stats.page";

import { WordsProvider } from "./contexts/words/words.context";
import { BulletsProvider } from "./contexts/bullets/bullets.context";
import { UserProvider } from "./contexts/user/user.context";

import "./App.css";
import HelpPage from "./pages/game/game-help/game-help.page";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BulletsProvider>
          <WordsProvider>
            <Routes>
              <Route index element={<SignIn />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="game">
                <Route path="homepage" element={<GameHomepage />} />
                <Route path="gamePage" element={<GamePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="stats" element={<StatsPage />} />
                <Route path="help" element={<HelpPage />} />
              </Route>
            </Routes>
          </WordsProvider>
        </BulletsProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
