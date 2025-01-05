import { createContext, useState, useMemo } from "react";

import { Words } from '../../utilis/class/word'

const WordsContext = createContext();

function WordsProvider({ children }) {
  const [currentSelectedWords] = useState(new Words());
  const [currentSelectedWord, setCurrentSelectedWord] = useState(undefined);
  const [selectedWordInfo, setSelectedWordInfo] = useState(undefined);
  const [wordsCollection, setWordsCollection] = useState([
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

  const updateCurrentSelectedWord = (newSelectedWord) =>
  {
    console.log(newSelectedWord)
    setCurrentSelectedWord(newSelectedWord)
    console.log(`hello ${currentSelectedWord}`)
  };
  const updateWordsCollection = (newWordsCollection) =>
    setWordsCollection(newWordsCollection);
  const updateSelectedWordInfo = (newSelectedWordInfo) =>
    setSelectedWordInfo(newSelectedWordInfo);

  const wordsContextValue = useMemo(() => ({
    wordsCollection,
    updateWordsCollection,
    currentSelectedWords,
    currentSelectedWord,
    updateCurrentSelectedWord,
    selectedWordInfo,
    updateSelectedWordInfo,
  }), [wordsCollection, currentSelectedWords, currentSelectedWord, selectedWordInfo]);
  

  return (
    <WordsContext.Provider value={wordsContextValue}>
      {children}
    </WordsContext.Provider>
  );
}

export { WordsContext, WordsProvider,};
