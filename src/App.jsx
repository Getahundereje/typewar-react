import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignInSignUp from "./pages/sign-in-up/sign-in-up/sign-in-up.page";
import GameHomepage from "./pages/game/homepage/homepage.page";
import GamePage from "./pages/game/game-page/game-page.page";
import SettingsPage from "./pages/game/settings/settings.page";
import StatsPage from "./pages/game/game-stats/game-stats.page";

import { WordsProvider } from "./contexts/words/words.context";
import { BulletsProvider } from "./contexts/bullets/bullets.context";
import { UserProvider } from "./contexts/user/user.context";

import "./App.css";
import HelpPage from "./pages/game/game-help/game-help.page";
import ComingSoon from "./components/comming-soon/comming-soon.component";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BulletsProvider>
          <WordsProvider>
            <Routes>
              <Route index element={<SignInSignUp />} />
              <Route path="signin" element={<SignInSignUp />} />
              <Route path="signup" element={<SignInSignUp signIn={false} />} />
              <Route path="game">
                <Route path="homepage" element={<GameHomepage />} />
                <Route path="comingSoon" element={<ComingSoon />} />
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
