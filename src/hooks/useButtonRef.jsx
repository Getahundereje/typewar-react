import { useRef } from "react";

function useButtonRef() {
  const continueRef = useRef();
  const newGameRef = useRef();
  const statsRef = useRef();
  const settingsRef = useRef();
  const helpRef = useRef();

  return [continueRef, newGameRef, settingsRef, statsRef, helpRef];
}

export { useButtonRef };
