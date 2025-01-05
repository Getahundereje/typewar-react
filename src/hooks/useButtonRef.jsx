import { useRef } from "react";

function useButtonRef() {
  const newGameRef = useRef();
  const statsRef = useRef();
  const settingsRef = useRef();
  const quitGameRef = useRef();

  return [newGameRef, settingsRef, statsRef, quitGameRef];
}

export { useButtonRef };
