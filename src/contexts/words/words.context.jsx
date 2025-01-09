import { createContext, useRef } from "react";

import { Words } from "../../utilis/class/word";

const WordsContext = createContext();

// eslint-disable-next-line react/prop-types
function WordsProvider({ children }) {
  let { current: currentSelectedCharacter } = useRef(undefined);
  let { current: currentSelectedWords } = useRef(new Words());
  let { current: currentSelectedWord } = useRef(undefined);
  let { current: selectedWordInfo } = useRef({});
  let { current: wordsCollection } = useRef([
    "GETAHUN",
    "NATI",
    "KALEAB",
    "JO",
    "EYOB",
    "HELLO",
    "GOODBYE",
    "GOOD",
    "BAD",
    "EVIL",
    "JOHN",
  ]);

  const wordsContextValue = {
    currentSelectedCharacter,
    wordsCollection,
    currentSelectedWords,
    currentSelectedWord,
    selectedWordInfo,
  };

  return (
    <WordsContext.Provider value={wordsContextValue}>
      {children}
    </WordsContext.Provider>
  );
}

export { WordsContext, WordsProvider };
