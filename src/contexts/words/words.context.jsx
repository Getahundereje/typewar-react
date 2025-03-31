import { createContext, useState, useEffect, useRef } from "react";
import { Words } from "../../utilis/class/word";

const initialVelocity = {
  x: 0.5,
  y: 0.5,
};

const WordsContext = createContext();

// eslint-disable-next-line react/prop-types
function WordsProvider({ children }) {
  const [wordsCollection, setWordsCollection] = useState([]);
  const notSelectedWords = useRef([...wordsCollection]);
  const currentSelectedCharacter = useRef("");
  const currentSelectedWords = useRef(new Words());
  const currentSelectedWord = useRef("");
  const selectedWordInfo = useRef({});
  const wordsPosition = useRef([]);
  const wordVelocity = useRef(initialVelocity);

  useEffect(() => {
    notSelectedWords.current = [...wordsCollection];
  }, [wordsCollection]);

  function reset() {
    if (wordsCollection.length) {
      currentSelectedCharacter.current = "";
      currentSelectedWord.current = "";
      selectedWordInfo.current = {};
      currentSelectedWords.current.clear();
      wordsPosition.current = [];
      wordVelocity.current = initialVelocity;
      notSelectedWords.current = [...wordsCollection];
    }
  }

  const wordsContextValue = {
    currentSelectedCharacter,
    wordsCollection,
    setWordsCollection,
    currentSelectedWords,
    currentSelectedWord,
    notSelectedWords,
    selectedWordInfo,
    wordsPosition,
    wordVelocity,

    reset,
  };

  return (
    <WordsContext.Provider value={wordsContextValue}>
      {children}
    </WordsContext.Provider>
  );
}

export { WordsContext, WordsProvider };
