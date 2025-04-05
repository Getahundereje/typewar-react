import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignInSignUp from "./pages/sign-in-up/sign-in-up/sign-in-up.page";
import GameHomepage from "./pages/game/homepage/homepage.page";
import GamePage from "./pages/game/game-page/game-page.page";
import SettingsPage from "./pages/game/settings/settings.page";
import StatsPage from "./pages/game/game-stats/game-stats.page";
import HelpPage from "./pages/game/game-help/game-help.page";
import ComingSoon from "./components/comming-soon/comming-soon.component";
import ProtectRoute from "./components/protectRoute/protect-route.component";

import { WordsProvider } from "./contexts/words/words.context";
import { BulletsProvider } from "./contexts/bullets/bullets.context";
import { UserProvider } from "./contexts/user/user.context";

import "./App.css";

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
                <Route
                  path="homepage"
                  element={<ProtectRoute Component={GameHomepage} />}
                />
                <Route path="comingSoon" element={<ComingSoon />} />
                <Route
                  path="gamePage"
                  element={<ProtectRoute Component={GamePage} />}
                />
                <Route
                  path="settings"
                  element={<ProtectRoute Component={SettingsPage} />}
                />
                <Route
                  path="stats"
                  element={<ProtectRoute Component={StatsPage} />}
                />
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
