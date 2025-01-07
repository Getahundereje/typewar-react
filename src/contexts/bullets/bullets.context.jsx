import { createContext } from "react";

import { Bullets } from "../../utilis/class/bullet";

const BulletsContext = createContext();

// eslint-disable-next-line react/prop-types
function BulletsProvider({ children }) {
  const bulletsContextValue = {
    bullets: new Bullets(),
  };

  return (
    <BulletsContext.Provider value={bulletsContextValue}>
      {children}
    </BulletsContext.Provider>
  );
}

export { BulletsContext, BulletsProvider };
