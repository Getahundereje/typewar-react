import { createContext, useState, useEffect, useRef } from "react";
import { Word, Words } from "../../utilis/class/word";
import useSessionStorage from "../../hooks/useSessionStorage";

const initialVelocity = {
  x: 0.5,
  y: 0.5,
};

const WordsContext = createContext();

// eslint-disable-next-line react/prop-types
function WordsProvider({ children }) {
  const [wordContext, setWordsContext] = useSessionStorage("wordContext", {});

  const [wordsCollection, setWordsCollection] = useState(
    wordContext.wordsCollection ?? []
  );
  const notSelectedWords = useRef(
    wordContext.notSelectedWords ?? [...wordsCollection]
  );
  const currentSelectedCharacter = useRef(
    wordContext.currentSelectedCharacter ?? ""
  );
  const currentSelectedWords = useRef(
    Words.fromArray(wordContext.currentSelectedWords) ?? new Words()
  );
  const currentSelectedWord = useRef(
    Word.fromJSON(wordContext.currentSelectedWord) ?? ""
  );
  const selectedWordInfo = useRef(wordContext.selectedWordInfo ?? {});
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

  function save() {
    let selectedWord, selectedWords;
    if (currentSelectedWords.current) {
      selectedWords = currentSelectedWords.current.toArray();
    }

    if (currentSelectedWord.current[""]) {
      selectedWord = currentSelectedWord.current[""].toJSON();
    }

    setWordsContext({
      wordsCollection: wordsCollection,
      notSelectedWords: notSelectedWords.current,
      currentSelectedWords: selectedWords,
      currentSelectedWord: selectedWord,
      selectedWordInfo: selectedWordInfo.current,
    });
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
    save,
  };

  return (
    <WordsContext.Provider value={wordsContextValue}>
      {children}
    </WordsContext.Provider>
  );
}

export { WordsContext, WordsProvider };
