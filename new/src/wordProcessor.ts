import { Word } from "./reportModel";

export function processWords(words: Word[] | string | Word | undefined) {
    if (words === undefined) {
        return "";
    } else if (Array.isArray(words)) {
        return processArray(words);
    } else if (typeof words === "string") {
        return capitaliseFirstLetter(words);
    } else {
        return processWord(words);
    }
}

function processArray(array: Word[]) {
    if (array.length > 0) {
        return processWordArray(array);
    }
    return "";
}

function processWordArray(wordArray: Word[]) {
    return wordArray.map(processWord).join(" ");
}

function processWord(word: Word) {
    const value = word.value;
    return word.isIntroWord ? capitaliseFirstLetter(value) : value;
}

function capitaliseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
