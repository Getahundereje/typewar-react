import { createContext, useState, useEffect, useRef } from "react";
import { Words } from "../../utilis/class/word";

const WordsContext = createContext();

// eslint-disable-next-line react/prop-types
function WordsProvider({ children }) {
  const [wordsCollection, setWordsCollection] = useState([]);
  let [notSelectedWords, setNotSelectedWords] = useState([...wordsCollection]);
  let { current: currentSelectedCharacter } = useRef("");
  let { current: currentSelectedWords } = useRef(new Words());
  let { current: currentSelectedWord } = useRef("");
  let { current: selectedWordInfo } = useRef({});

  useEffect(() => {
    setNotSelectedWords([...notSelectedWords, ...wordsCollection]);
    console.log("heloooooooooooo");
  }, [wordsCollection]);

  const wordsContextValue = {
    currentSelectedCharacter,
    wordsCollection,
    setWordsCollection,
    setNotSelectedWords,
    currentSelectedWords,
    currentSelectedWord,
    notSelectedWords,
    selectedWordInfo,
  };

  return (
    <WordsContext.Provider value={wordsContextValue}>
      {children}
    </WordsContext.Provider>
  );
}

export { WordsContext, WordsProvider };
